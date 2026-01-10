import { IBuffer, IDispatcher } from './type'

export class BufferConsumer<T = any> {

  constructor(
    protected buffer: IBuffer<T>,
    protected dispatcher?: IDispatcher<T>
  ) { }

  send(item: T) {
    this.buffer.send(item)
  }

  execute() {
    const items = this.buffer.flush()

    if (!this.dispatcher) {
      return
    }

    let i = 0, length = items.length
    while (i < length) {
      this.dispatcher.dispatch(items[i])
      i++
    }
  }
}
