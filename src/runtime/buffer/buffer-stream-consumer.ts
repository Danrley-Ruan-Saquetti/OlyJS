import { BufferStream } from './buffer-stream'
import { IBufferStream, IDispatcher } from './type'

export class BufferStreamConsumer {

  protected buffer: IBufferStream

  constructor(
    stream?: IBufferStream,
    protected dispatcher?: IDispatcher
  ) {
    this.buffer = stream ?? new BufferStream()
  }

  send(key: string, data: unknown) {
    this.buffer.send(key, data)
  }

  execute() {
    const count = this.buffer.flush()

    if (!this.dispatcher) {
      return
    }

    let i = 0
    while (i < count) {
      this.dispatcher.dispatch(
        this.buffer.getFlushedKey(i),
        this.buffer.getFlushedData(i)
      )
      i++
    }
  }
}
