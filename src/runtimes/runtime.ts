import { EventEmitter, Listener } from '@common/event/event-emitter.js'
import { EventQueue } from '@common/event/event-queue.js'
import { EventMap } from '@common/event/types.js'

export abstract class Runtime<Events extends EventMap = any> {

  protected readonly emitter = new EventEmitter<Events>()
  protected readonly incoming = new EventQueue<Events>()

  on<KEvent extends keyof Events>(event: KEvent, listener: Listener<Events[KEvent]>) {
    this.emitter.on(event, listener)
  }

  protected emit<KEvent extends keyof Events>(event: KEvent, payload: Events[KEvent]) {
    this.emitter.emit(event, payload)
  }

  abstract send<KEvent extends keyof Events>(event: KEvent, payload: Events[KEvent]): void

  protected receive<KEvent extends keyof Events>(event: KEvent, payload: Events[KEvent]) {
    this.incoming.push(event, payload)
  }

  flushEvents() {
    return this.incoming.flush()
  }
}
