import { ISystem } from '../ecs/system'
import { World } from '../ecs/world'
import { EngineContext } from '../runtime/contracts/engine-context'
import { EventMap, Listener } from '../runtime/contracts/event'
import { SystemContext } from '../runtime/contracts/system-context'
import { BufferedEventBus } from './events/buffered-event-bus'
import { IBufferedEventBus } from './events/types'
import { TimeTracker } from './time/time-tracker'
import { ITimerTracker } from './time/types'
import { IEngine } from './types'

export class Engine<Events extends EventMap = {}> implements IEngine<Events> {

  protected readonly systems: ISystem[] = []
  protected readonly clock: ITimerTracker = new TimeTracker()
  protected readonly emitter: IBufferedEventBus<Events> = new BufferedEventBus<Events>()

  protected readonly world = new World()

  protected readonly engineContext: EngineContext<Events> = {
    world: this.world,
    events: {
      on: this.on.bind(this),
      send: this.send.bind(this),
      off: this.off.bind(this),
      clear: this.clear.bind(this),
    }
  }
  protected readonly systemContext: SystemContext<Events> = {
    world: this.world,
    deltaTime: this.clock.time,
    events: {
      send: this.send.bind(this)
    }
  }

  private _isRunning = false

  start() {
    if (this._isRunning) {
      return
    }

    this._isRunning = true

    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].start(this.engineContext)
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

  tick(deltaTime: number) {
    if (!this._isRunning) {
      return
    }

    this.clock.advance(deltaTime)

    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].update(this.systemContext)
      i++
    }

    this.emitter.execute()
  }

  registerSystem(system: ISystem<Events>) {
    this.systems.push(system)
  }

  on<E extends keyof Events>(event: E, listener: Listener<Events[E]>) {
    this.emitter.on(event, listener)
  }

  send<E extends keyof Events>(event: E, data: Events[E]) {
    this.emitter.send(event as keyof Events, data as any)
  }

  off<E extends keyof Events>(event: E, listener: Listener<Events[E]>) {
    this.emitter.off(event, listener)
  }

  clear(event?: keyof Events) {
    this.emitter.clear(event)
  }
}
