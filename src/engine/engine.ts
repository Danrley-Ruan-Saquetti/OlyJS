import { ISystem } from '../ecs/system'
import { EngineContext, EngineStartContext } from '../runtime/contracts/engine-context'
import { EventName, EventPriority, ListenerHandler } from '../runtime/contracts/event'
import { SystemContext } from '../runtime/contracts/system-context'
import { BufferedEventBus } from './events/buffered-event-bus'
import { EventBusPriority } from './events/event-bus-priority'
import { IBufferedEventBus } from './events/types'
import { IEngine } from './types'

export class Engine implements IEngine {

  protected readonly systems: ISystem[] = []

  protected eventBus = new EventBusPriority()
  protected readonly bufferedEmitter: IBufferedEventBus = new BufferedEventBus(this.eventBus)

  private _isRunning = false

  start(context: EngineStartContext) {
    if (this._isRunning) {
      return
    }

    const engineContext = this.createEngineContext(context)

    this._isRunning = true

    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].start(engineContext)
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
  }

  protected createEngineContext(context: EngineStartContext): EngineContext {
    return {
      world: context.world,
      events: {
        on: this.on.bind(this),
        send: this.send.bind(this),
        off: this.off.bind(this),
        clear: this.clear.bind(this),
      }
    }
  }

  registerSystem(system: ISystem) {
    this.systems.push(system)
  }

  isRunning() {
    return this._isRunning
  }

  on(event: EventName, listener: ListenerHandler, priority?: EventPriority) {
    this.eventBus.on(event, listener, priority)
  }

  send(event: EventName, data: unknown) {
    this.bufferedEmitter.send(event, data as any)
  }

  off(event: EventName, listener: ListenerHandler) {
    this.eventBus.off(event, listener)
  }

  clear(event?: EventName) {
    this.eventBus.clear(event)
  }
}
