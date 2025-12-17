import { DeltaTimer } from '@common/delta-time'
import { EventEmitter } from '@common/event/event-emitter'
import { EventQueue } from '@common/event/event-queue'
import { EventMap } from '@common/event/types'
import { EngineEvents, IEngine, IEngineRegisterEvent } from '@core/types'

export class Engine<Events extends EventMap = any> extends EventEmitter<Events> implements IEngine<Events> {

  protected emitter = new EventEmitter<EngineEvents>()
  protected eventQueue = new EventQueue<Events>()

  protected deltaTime = new DeltaTimer()

  private _isRunning = false

  registerListener(listener: IEngineRegisterEvent<Events>) {
    listener.registerEngine(this)
  }

  start() {
    if (this._isRunning) {
      return
    }

    this._isRunning = true

    this.deltaTime.reset()
    this.emitter.emit('engine:start', undefined)
  }

  stop() {
    if (!this._isRunning) {
      return
    }

    this._isRunning = false

    this.emitter.emit('engine:stop', undefined)
  }

  tick() {
    if (!this._isRunning) {
      return
    }

    this.deltaTime.tick()
    this.processEvents()
    this.emitter.emit('engine:tick', this.deltaTime.getState())
  }

  protected processEvents() {
    for (const { event, data } of this.eventQueue.flush()) {
      this.emitter.emit(event, data)
    }
  }
}
