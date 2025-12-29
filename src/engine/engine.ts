import { ISystem } from '../ecs/system'
import { IWorld } from '../ecs/world'
import { BufferStreamConsumer } from '../runtime/buffer/buffer-stream-consumer'
import { ICommandPublisher } from '../runtime/contracts/command'
import { EngineContext, EngineStartContext } from '../runtime/contracts/engine-context'
import { IEventPublisher } from '../runtime/contracts/event'
import { SystemContext } from '../runtime/contracts/system-context'
import { EventBus } from './events/event-bus'
import { EventBusPriority } from './events/event-bus-priority'
import { IEngine } from './types'

export class Engine implements IEngine {

  private _context: {
    world: IWorld
    events: IEventPublisher
    commands: ICommandPublisher
  }

  protected readonly systems: ISystem[] = []

  protected readonly eventBus = new EventBusPriority()
  protected readonly eventConsumer = new BufferStreamConsumer(this.eventBus)

  protected readonly commandEventBus = new EventBus()
  protected readonly commandConsumer = new BufferStreamConsumer(this.commandEventBus)

  private _isRunning = false

  get context(): EngineContext {
    return this._context
  }

  constructor() {
    this._context = {
      world: null! as IWorld,
      events: {
        on: this.eventBus.on.bind(this),
        send: this.eventConsumer.send.bind(this),
        off: this.eventBus.off.bind(this),
        clear: this.eventBus.clear.bind(this),
      },
      commands: {
        register: this.commandEventBus.on.bind(this),
        send: this.commandConsumer.send.bind(this),
      },
    }
  }

  start(context: EngineStartContext) {
    if (this._isRunning) {
      return
    }

    this._context.world = context.world
    this._isRunning = true

    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].start(this._context)
      i++
    }
  }

  stop() {
    if (!this._isRunning) {
      return
    }

    this._isRunning = false

    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].stop()
      i++
    }
  }

  tick(context: SystemContext) {
    if (!this._isRunning) {
      return
    }

    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].update(context)
      i++
    }

    this.eventConsumer.execute()
    this.commandConsumer.execute()
  }

  registerSystem(system: ISystem) {
    this.systems.push(system)
  }

  isRunning() {
    return this._isRunning
  }
}
