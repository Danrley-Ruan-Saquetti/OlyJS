import { EventMap } from '@common/event/types.js'
import { Runtime } from '@runtimes/runtime.js'

export class LocalRuntime<Events extends EventMap = any> extends Runtime<Events> {

  private peer?: LocalRuntime<Events>

  connect(peer: LocalRuntime<Events>) {
    this.peer = peer
    peer.peer = this
  }

  send<KEvent extends keyof Events>(event: KEvent, payload: Events[KEvent]) {
    this.peer?.emit(event, payload)
  }
}
