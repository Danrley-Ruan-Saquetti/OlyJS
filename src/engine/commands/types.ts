import { IBufferStream, StreamDataMap } from '../../runtime/buffer/type'

export type IBufferedCommandQueue<StreamData extends StreamDataMap = {}> = IBufferStream<StreamData>
