import { DeltaTime, DeltaTimer } from '@common/delta-time'
import { EventEmitter } from '@common/event/event-emitter'
import { EventQueue } from '@common/event/event-queue'

export type EngineEvents = {
  'engine:start': undefined
  'engine:tick': DeltaTime
  'engine:stop': undefined
}

export class Engine {

  protected emitter = new EventEmitter<EngineEvents>()
  protected eventQueue = new EventQueue<EngineEvents>()

  protected deltaTime = new DeltaTimer()

  private _isRunning = false

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
