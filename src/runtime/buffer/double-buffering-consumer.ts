import { BufferConsumer } from './buffer-consumer'
import { DoubleBuffering } from './double-buffering'
import { IDispatcher } from './type'

export class DoubleBufferingConsumer<T> extends BufferConsumer<T> {

  constructor(dispatcher?: IDispatcher<T>) {
    super(new DoubleBuffering(), dispatcher)
  }
}
