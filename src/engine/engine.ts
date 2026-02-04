import { EngineInitializeContext } from '../contracts/context/engine.context'
import { SystemUpdateContext } from '../contracts/context/system.context'
import { ICommandDomain } from '../contracts/engine/command'
import { EventTuple } from '../contracts/engine/event'
import { ISystem } from '../ecs/system'
import { DoubleBufferingConsumer } from '../runtime/buffer/double-buffering-consumer'
import { CommandScheduler } from './command/command-scheduler'
import { EventBusPriority } from './events/event-bus-priority'
import { EventDispatcher } from './events/event-dispatcher'
import { MutableSystemInitializeContext } from './mutable-system-initialize-context'
import { SystemScheduler } from './system/system-scheduler'
import { IEngine } from './types'

export class Engine implements IEngine {

  protected readonly systemScheduler: SystemScheduler
  protected readonly commandScheduler = new CommandScheduler()

  protected readonly eventBus = new EventBusPriority()
  protected readonly eventDispatcher = new EventDispatcher(this.eventBus)
  protected readonly eventConsumer = new DoubleBufferingConsumer<EventTuple>(this.eventDispatcher)

  private systemInitializeContext = new MutableSystemInitializeContext()

  private _isRunning = false
  private isInitialized = false

  constructor() {
    this.systemScheduler = new SystemScheduler(this.systemInitializeContext)

    this.systemInitializeContext.events = {
      on: this.eventDispatcher.on.bind(this.eventDispatcher),
      send: (event: string, data: unknown) => this.eventConsumer.send([event, data]),
      off: this.eventDispatcher.off.bind(this.eventDispatcher),
      clear: this.eventDispatcher.clear.bind(this.eventDispatcher),
    }
    this.systemInitializeContext.commands = {
      register: this.commandScheduler.register.bind(this.commandScheduler),
    }
  }

  initialize(context: EngineInitializeContext) {
    if (this.isInitialized) {
      throw new Error('It is not possible to initialize an engine that has already been initialized')
    }

    this.systemInitializeContext.world = context.world
    this.systemInitializeContext.scheduler = context.scheduler
    this.isInitialized = true
  }

  start() {
    if (this._isRunning) {
      throw new Error('Engine already started')
    }

    this._isRunning = true
    this.systemScheduler.start()
  }

  stop() {
    if (!this._isRunning) {
      throw new Error('Engine already stopped')
    }

    this._isRunning = false
    this.systemScheduler.stop()
  }

  tick(context: SystemUpdateContext) {
    if (!this._isRunning) {
      return
    }

    this.systemScheduler.tick(context)
    this.eventConsumer.execute()
    this.commandScheduler.flush()
  }

  registerSystem(system: ISystem) {
    this.systemScheduler.register(system)
  }

  registerCommandDomain(domain: ICommandDomain) {
    this.commandScheduler.register(domain)
  }

  isRunning() {
    return this._isRunning
  }
}
