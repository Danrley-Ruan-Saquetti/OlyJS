import { ISystem } from '../ecs/system'
import { IWorld } from '../ecs/world'
import { ICommandPublisher } from '../runtime/contracts/command'
import { EngineContext, EngineStartContext } from '../runtime/contracts/engine-context'
import { IEventPublisher } from '../runtime/contracts/event'
import { SystemContext } from '../runtime/contracts/system-context'
import { CommandDispatcher } from './commands/command-dispatcher'
import { BufferedEventBus } from './events/buffered-event-bus'
import { BufferedEventQueue } from './events/buffered-event-queue'
import { EventBus } from './events/event-bus'
import { EventBusPriority } from './events/event-bus-priority'
import { IBufferedEventBus } from './events/types'
import { IEngine } from './types'

export class Engine implements IEngine {

  private _context: {
    world: IWorld
    events: IEventPublisher
    commands: ICommandPublisher
  }

  protected readonly systems: ISystem[] = []

  protected eventBus = new EventBusPriority()
  protected readonly bufferedEmitter: IBufferedEventBus = new BufferedEventBus(this.eventBus)

  protected commandEventBus = new EventBus()
  protected readonly bufferedEventQueue = new BufferedEventQueue()
  protected readonly commandDispatcher = new CommandDispatcher(this.commandEventBus)

  private _isRunning = false

  get context(): EngineContext {
    return this._context
  }

  constructor() {
    this._context = {
      world: null! as IWorld,
      events: {
        on: this.eventBus.on.bind(this),
        send: this.bufferedEmitter.send.bind(this),
        off: this.eventBus.off.bind(this),
        clear: this.eventBus.clear.bind(this),
      },
      commands: {
        register: this.commandEventBus.on.bind(this),
        send: this.bufferedEventQueue.send.bind(this),
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

    this.bufferedEmitter.execute()
    this.commandDispatcher.execute()
  }

  registerSystem(system: ISystem) {
    this.systems.push(system)
  }

  isRunning() {
    return this._isRunning
  }
}
