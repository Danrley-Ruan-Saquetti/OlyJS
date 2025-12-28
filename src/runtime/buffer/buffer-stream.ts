import { IBufferStream, StreamDataMap } from './type'

export class BufferStream<StreamData extends StreamDataMap = {}> implements IBufferStream<StreamData> {

  private bufferKey: (keyof StreamData)[] = []
  private bufferData: StreamData[keyof StreamData][] = []

  private swapKey: (keyof StreamData)[] = []
  private swapData: StreamData[keyof StreamData][] = []

  send<E extends keyof StreamData>(key: E, data: StreamData[E]) {
    this.bufferKey.push(key)
    this.bufferData.push(data)
  }

  flush() {
    const tempKeys = this.bufferKey
    this.bufferKey = this.swapKey
    this.swapKey = tempKeys

    const tempData = this.bufferData
    this.bufferData = this.swapData
    this.swapData = tempData

    this.bufferKey.length = 0
    this.bufferData.length = 0

    return this.swapKey.length
  }

  getFlushedKey(index: number) {
    return this.swapKey[index]
  }

  getFlushedData(index: number) {
    return this.swapData[index]
  }
}
