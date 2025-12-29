import { EventMap } from '../contracts/event'

export type StreamDataMap = EventMap

export interface IBufferSender {
  send(key: string, data: unknown): void
}

export interface IBufferStream extends IBufferSender {
  flush(): number
  getFlushedKey(index: number): string
  getFlushedData(index: number): unknown
}
