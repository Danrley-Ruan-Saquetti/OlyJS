import { ISystem } from '../ecs/system'
import { EngineContext, EngineStartContext } from '../runtime/contracts/engine-context'
import { EventMap, EventPriority, ListenerHandler } from '../runtime/contracts/event'
import { SystemContext } from '../runtime/contracts/system-context'
import { BufferedEventBus } from './events/buffered-event-bus'
import { IBufferedEventBus } from './events/types'
import { IEngine } from './types'

export class Engine<Events extends EventMap = {}> implements IEngine<Events> {

  protected readonly systems: ISystem[] = []
  protected readonly emitter: IBufferedEventBus<Events> = new BufferedEventBus<Events>()

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

    this.emitter.execute()
  }

  protected createEngineContext(context: EngineStartContext): EngineContext<Events> {
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

  registerSystem(system: ISystem<Events>) {
    this.systems.push(system)
  }

  isRunning() {
    return this._isRunning
  }

  on<E extends keyof Events>(event: E, listener: ListenerHandler<Events[E]>, priority?: EventPriority) {
    this.emitter.on(event, listener, priority)
  }

  send<E extends keyof Events>(event: E, data: Events[E]) {
    this.emitter.send(event as keyof Events, data as any)
  }

  off<E extends keyof Events>(event: E, listener: ListenerHandler<Events[E]>) {
    this.emitter.off(event, listener)
  }

  clear(event?: keyof Events) {
    this.emitter.clear(event)
  }
}
