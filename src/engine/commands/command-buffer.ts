import { BufferStream } from '../../runtime/buffer/buffer-stream'
import { StreamDataMap } from '../../runtime/buffer/type'
import { IBufferedCommandQueue } from './types'

export class CommandBuffer<CommandData extends StreamDataMap = {}> extends BufferStream<CommandData> implements IBufferedCommandQueue<CommandData> {
}
