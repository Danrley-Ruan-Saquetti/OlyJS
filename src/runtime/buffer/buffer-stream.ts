import { IBufferStream } from './type'

export class BufferStream implements IBufferStream {

  private bufferKey: string[] = []
  private bufferData: unknown[] = []

  private swapKey: string[] = []
  private swapData: unknown[] = []

  send(key: string, data: unknown) {
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
