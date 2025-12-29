import { BufferStream } from '../../runtime/buffer/buffer-stream'
import { IBufferedCommandQueue } from './types'

export class CommandBuffer extends BufferStream implements IBufferedCommandQueue { }
