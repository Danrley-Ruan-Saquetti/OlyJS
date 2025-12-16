import { EventEmitter, Listener } from '@common/event/event-emitter.js'
import { EventQueue } from '@common/event/event-queue.js'
import { EventMap } from '@common/event/types.js'

export abstract class Runtime<InEvents extends EventMap = any, OutEvents extends EventMap = any> {

  protected readonly emitter = new EventEmitter<OutEvents>()
  protected readonly incoming = new EventQueue<InEvents>()

  on<KEvent extends keyof OutEvents>(event: KEvent, listener: Listener<OutEvents[KEvent]>) {
    this.emitter.on(event, listener)
  }

  protected emit<KEvent extends keyof OutEvents>(event: KEvent, payload: OutEvents[KEvent]) {
    this.emitter.emit(event, payload)
  }

  abstract send<KEvent extends keyof InEvents>(event: KEvent, payload: InEvents[KEvent]): void

  protected receive<KEvent extends keyof InEvents>(event: KEvent, payload: InEvents[KEvent]) {
    this.incoming.push(event, payload)
  }

  flushEvents() {
    return this.incoming.flush()
  }
}
