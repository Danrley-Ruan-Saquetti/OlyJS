import { BufferStream } from '../../runtime'
import { EventMap } from '../../runtime/contracts/event'
import { IBufferedEventQueue } from './types'

export class BufferedEventQueue<Events extends EventMap = {}> extends BufferStream<Events> implements IBufferedEventQueue<Events> {

}
