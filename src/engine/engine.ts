import { ISystem } from '../ecs/system'
import { World } from '../ecs/world'
import { EventMap, Listener } from '../runtime/contracts/event'
import { SystemContext } from '../runtime/contracts/system-context'
import { BufferedEventBus } from './events/buffered-event-bus'
import { IBufferedEventBus } from './events/types'
import { Clock } from './time/clock'
import { ITimer } from './time/types'
import { IEngine } from './types'

export class Engine<Events extends EventMap = {}> implements IEngine<Events> {

  protected systems: ISystem[] = []
  protected clock: ITimer = new Clock()
  protected emitter: IBufferedEventBus<Events> = new BufferedEventBus<Events>()

  protected world = new World()
  protected systemContext: SystemContext<Events>

  private _isRunning = false

  constructor() {
    this.systemContext = {
      world: this.world,
      deltaTime: this.clock.time,
      events: {
        send: this.send.bind(this)
      }
    }
  }

  start() {
    if (this._isRunning) {
      return
    }

    this._isRunning = true

    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].start()
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

  tick() {
    if (!this._isRunning) {
      return
    }

    this.clock.tick()

    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].update(this.systemContext)
      i++
    }

    this.emitter.execute()
  }

  registerSystem(system: ISystem) {
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
