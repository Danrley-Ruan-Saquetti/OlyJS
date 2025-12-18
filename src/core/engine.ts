import { DeltaTimer } from '@common/delta-time'
import { EventEmitter } from '@common/event/event-emitter'
import { EventQueue } from '@common/event/event-queue'
import { EventMap, Listener } from '@common/event/types'
import { EngineEventMap, IEngine, IEngineRegisterEvent } from '@core/types'

export class Engine<InEvents extends EventMap = {}> implements IEngine<InEvents> {

  protected emitter = new EventEmitter<EngineEventMap<InEvents>>()
  protected eventQueue = new EventQueue<EngineEventMap<InEvents>>()

  protected deltaTime = new DeltaTimer()

  private _isRunning = false

  registerListener(listener: IEngineRegisterEvent<InEvents>) {
    listener.registerEngine(this)
  }

  start() {
    if (this._isRunning) {
      return
    }

    this._isRunning = true

    this.deltaTime.reset()
    this.emitter.emit('engine:start', undefined as EngineEventMap<InEvents>['engine:start'])
  }

  stop() {
    if (!this._isRunning) {
      return
    }

    this._isRunning = false

    this.emitter.emit('engine:stop', undefined as EngineEventMap<InEvents>['engine:stop'])
  }

  tick() {
    if (!this._isRunning) {
      return
    }

    this.deltaTime.tick()
    this.processEvents()
    this.emitter.emit('engine:tick', this.deltaTime.getState() as EngineEventMap<InEvents>['engine:tick'])
  }

  protected processEvents() {
    for (const { event, data } of this.eventQueue.flush()) {
      this.emitter.emit(event, data)
    }
  }

  once<E extends keyof EngineEventMap<InEvents>>(event: E, listener: Listener<EngineEventMap<InEvents>[E]>) {
    this.emitter.once(event, listener)
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
