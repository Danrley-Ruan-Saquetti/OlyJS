import { ISystem } from '../ecs/system'
import { IWorld } from '../ecs/world'
import { DoubleBufferingConsumer } from '../runtime/buffer/double-buffering-consumer'
import { ICommandDomain } from '../runtime/contracts/command'
import { EngineContext, EngineStartContext } from '../runtime/contracts/context/engine.context'
import { SystemContext } from '../runtime/contracts/context/system.context'
import { EventTuple } from '../runtime/contracts/event'
import { CommandScheduler } from './command/command-scheduler'
import { EventBusPriority } from './events/event-bus-priority'
import { EventDispatcher } from './events/event-dispatcher'
import { SystemScheduler } from './system/system-scheduler'
import { IEngine } from './types'

export class Engine implements IEngine {

  protected readonly systemScheduler: SystemScheduler
  protected readonly commandScheduler = new CommandScheduler()

  protected readonly eventBus = new EventBusPriority()
  protected readonly eventDispatcher = new EventDispatcher(this.eventBus)
  protected readonly eventConsumer = new DoubleBufferingConsumer<EventTuple>(this.eventDispatcher)

  private _context = {
    world: null! as IWorld,
    events: {
      on: this.eventDispatcher.on.bind(this.eventDispatcher),
      send: (event: string, data: unknown) => this.eventConsumer.send([event, data]),
      off: this.eventDispatcher.off.bind(this.eventDispatcher),
      clear: this.eventDispatcher.clear.bind(this.eventDispatcher),
    },
  }

  private _isRunning = false

  get context(): EngineContext {
    return this._context
  }

  constructor() {
    this.systemScheduler = new SystemScheduler(this._context)
  }

  start(context: EngineStartContext) {
    if (this._isRunning) {
      return
    }

    this._context.world = context.world
    this._isRunning = true
    this.systemScheduler.startAll()
  }

  stop() {
    if (!this._isRunning) {
      return
    }

    this._isRunning = false
    this.systemScheduler.stopAll()
  }

  tick(context: SystemContext) {
    if (!this._isRunning) {
      return
    }

    this.systemScheduler.tickAll(context)
    this.eventConsumer.execute()
    this.commandScheduler.flushAll()
  }

  registerSystem(system: ISystem) {
    this.systemScheduler.register(system)

    system.initialize(this._context)
  }

  registerCommandDomain(domain: ICommandDomain) {
    this.commandScheduler.register(domain)
  }

  isRunning() {
    return this._isRunning
  }
}
