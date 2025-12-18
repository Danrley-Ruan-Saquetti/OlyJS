import { ISystem } from '@ecs/system.js'
import { World } from '@ecs/world.js'
import { EventEmitter } from '@engine/events/event-emitter.js'
import { EventQueue } from '@engine/events/event-queue.js'
import { Clock } from '@engine/time/clock.js'
import { EngineEventMap, IEngine } from '@engine/types.js'
import { EventMap, Listener } from '@runtime/contracts/event.js'

export class Engine<InEvents extends EventMap = {}> implements IEngine<InEvents> {

  protected systems: ISystem[] = []

  protected world = new World()

  protected emitter = new EventEmitter<EngineEventMap<InEvents>>()
  protected eventQueue = new EventQueue<EngineEventMap<InEvents>>()

  protected clock = new Clock()

  private _isRunning = false

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

    this.emitter.emit('engine:start', undefined as EngineEventMap<InEvents>['engine:start'])
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

    this.emitter.emit('engine:stop', undefined as EngineEventMap<InEvents>['engine:stop'])
  }

  tick() {
    if (!this._isRunning) {
      return
    }

    this.clock.tick()
    const deltaTime = this.clock.getState()

    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].update(this.world, deltaTime)
      i++
    }

    this.processEvents()
  }

  protected processEvents() {
    for (const { event, data } of this.eventQueue.flush()) {
      this.emitter.emit(event, data)
    }
  }

  registerSystem(system: ISystem) {
    this.systems.push(system)
  }

  on<E extends keyof EngineEventMap<InEvents>>(event: E, listener: Listener<EngineEventMap<InEvents>[E]>) {
    this.emitter.on(event, listener)
  }

  emit<E extends keyof InEvents>(event: E, data: InEvents[E]) {
    this.eventQueue.push(event as keyof EngineEventMap<InEvents>, data as any)
  }

  off<E extends keyof EngineEventMap<InEvents>>(event: E, listener: Listener<EngineEventMap<InEvents>[E]>) {
    this.emitter.off(event, listener)
  }

  clear(event?: keyof EngineEventMap<InEvents>) {
    this.emitter.clear(event)
  }
}
