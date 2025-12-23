import { EventMap, IEventSender } from '../../runtime/contracts/event'
import { IEventQueue } from './types'

export class BufferedEventQueue<Events extends EventMap = {}> implements IEventSender<Events>, IEventQueue<Events> {

  private bufferEvents: (keyof Events)[] = []
  private bufferData: Events[keyof Events][] = []

  private swapEvents: (keyof Events)[] = []
  private swapData: Events[keyof Events][] = []

  send<E extends keyof Events>(event: E, data: Events[E]) {
    this.bufferEvents.push(event)
    this.bufferData.push(data)
  }

  flush() {
    const tempEvents = this.bufferEvents
    this.bufferEvents = this.swapEvents
    this.swapEvents = tempEvents

    const tempData = this.bufferData
    this.bufferData = this.swapData
    this.swapData = tempData

    this.bufferEvents.length = 0
    this.bufferData.length = 0

    return this.swapEvents.length
  }

  getFlushedEvent(index: number) {
    return this.swapEvents[index]
  }

  getFlushedData(index: number) {
    return this.swapData[index]
  }
}
