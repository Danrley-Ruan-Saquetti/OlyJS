import { ISystem } from '@ecs/system'
import { World } from '@ecs/world'
import { BufferedEventBus } from '@engine/events/buffered-event-bus'
import { Clock } from '@engine/time/clock'
import { EngineEventMap, IEngine } from '@engine/types'
import { EventMap, Listener } from '@runtime/contracts/event'
import { SystemContext } from '@runtime/contracts/system-context'

export class Engine<ExternalEvents extends EventMap = {}> implements IEngine<ExternalEvents> {

  protected systems: ISystem[] = []

  protected world = new World()
  protected clock = new Clock()

  protected emitter = new BufferedEventBus<EngineEventMap<ExternalEvents>>()

  private _isRunning = false

  protected systemContext: SystemContext<ExternalEvents>

  constructor() {
    this.systemContext = {
      world: this.world,
      deltaTime: this.clock.getState(),
      events: this
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

    this.emitter.emit('engine:start', undefined as EngineEventMap<ExternalEvents>['engine:start'])
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

    this.emitter.emit('engine:stop', undefined as EngineEventMap<ExternalEvents>['engine:stop'])
  }

  tick() {
    if (!this._isRunning) {
      return
    }

    this.clock.tick()
    this.systemContext.deltaTime = this.clock.getState()

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

  on<E extends keyof EngineEventMap<ExternalEvents>>(event: E, listener: Listener<EngineEventMap<ExternalEvents>[E]>) {
    this.emitter.on(event, listener)
  }

  send<E extends keyof ExternalEvents>(event: E, data: ExternalEvents[E]) {
    this.emitter.send(event as keyof EngineEventMap<ExternalEvents>, data as any)
  }

  off<E extends keyof EngineEventMap<ExternalEvents>>(event: E, listener: Listener<EngineEventMap<ExternalEvents>[E]>) {
    this.emitter.off(event, listener)
  }

  clear(event?: keyof EngineEventMap<ExternalEvents>) {
    this.emitter.clear(event)
  }
}
