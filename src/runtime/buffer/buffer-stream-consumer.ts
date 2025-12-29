import { EventName, IEventEmitter } from '../contracts/event'
import { BufferStream } from './buffer-stream'
import { IBufferStream } from './type'

export class BufferStreamConsumer {

  protected buffer: IBufferStream = new BufferStream()

  constructor(
    protected emitter: IEventEmitter
  ) { }

  send(event: EventName, data: unknown) {
    this.buffer.send(event, data)
  }

  execute() {
    const count = this.buffer.flush()

    let i = 0
    while (i < count) {
      this.emitter.emit(
        this.buffer.getFlushedKey(i),
        this.buffer.getFlushedData(i)
      )
      i++
    }
  }
}
