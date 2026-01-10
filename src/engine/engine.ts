import { ISystem } from '../ecs/system'
import { IWorld } from '../ecs/world'
import { DoubleBufferingConsumer } from '../runtime/buffer/double-buffering-consumer'
import { ICommandPublisher } from '../runtime/contracts/command'
import { EngineContext, EngineStartContext } from '../runtime/contracts/context/engine.context'
import { SystemContext } from '../runtime/contracts/context/system.context'
import { EventTuple, IEventPublisher } from '../runtime/contracts/event'
import { CommandDispatcher } from './command/command-dispatcher'
import { EventBusPriority } from './events/event-bus-priority'
import { EventDispatcher } from './events/event-dispatcher'
import { IEngine } from './types'

export class Engine implements IEngine {

  private _context: {
    world: IWorld
    events: IEventPublisher
    commands: ICommandPublisher
  }

  protected readonly systems: ISystem[] = []

  protected readonly eventBus = new EventBusPriority()
  protected readonly eventDispatcher = new EventDispatcher(this.eventBus)
  protected readonly eventConsumer = new DoubleBufferingConsumer<EventTuple>(this.eventDispatcher)

  protected readonly commandDispatcher = new CommandDispatcher()
  protected readonly commandConsumer = new DoubleBufferingConsumer<EventTuple>(this.commandDispatcher)

  private _isRunning = false

  get context(): EngineContext {
    return this._context
  }

  constructor() {
    this._context = {
      world: null! as IWorld,
      events: {
        on: this.eventDispatcher.on.bind(this.eventDispatcher),
        send: (event: string, data: unknown) => this.eventConsumer.send([event, data]),
        off: this.eventDispatcher.off.bind(this.eventDispatcher),
        clear: this.eventDispatcher.clear.bind(this.eventDispatcher),
      },
      commands: {
        register: this.commandDispatcher.register.bind(this.commandDispatcher),
        send: (event: string, data: unknown) => this.commandConsumer.send([event, data]),
      },
    }
  }

  start(context: EngineStartContext) {
    if (this._isRunning) {
      return
    }

    this._context.world = context.world
    this._isRunning = true
    this.startSystems()
  }

  stop() {
    if (!this._isRunning) {
      return
    }

    this._isRunning = false
    this.stopSystems()
  }

  tick(context: SystemContext) {
    if (!this._isRunning) {
      return
    }

    this.tickSystems(context)
    this.eventConsumer.execute()
    this.commandConsumer.execute()
  }

  registerSystem(system: ISystem) {
    this.systems.push(system)

    system.initialize(this._context)
  }

  private startSystems() {
    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].start()
      i++
    }
  }

  private stopSystems() {
    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].stop()
      i++
    }
  }

  private tickSystems(context: SystemContext) {
    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].update(context)
      i++
    }
  }

  isRunning() {
    return this._isRunning
  }
}
