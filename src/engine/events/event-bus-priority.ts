import { EventPriority, ListenerHandler } from '../../runtime/contracts/event'
import { IEventBusPriority, ListenersPriorityMap } from './types'

export class EventBusPriority implements IEventBusPriority {

  protected listeners: ListenersPriorityMap = Object.create(null)

  on(event: string, listener: ListenerHandler, priority = EventPriority.NORMAL) {
    let buckets = this.listeners[event]

    if (!buckets) {
      buckets = [[], [], []]

      this.listeners[event] = buckets
    }

    buckets[priority].push(listener)
  }

  emit(event: string, data: unknown) {
    const buckets = this.listeners[event]

    if (!buckets) {
      return
    }

    for (let i = 0, lengthBuckets = buckets.length; i < lengthBuckets; i++) {
      const bucket = buckets[i]

      for (let j = 0, lengthBucket = bucket.length; j < lengthBucket; j++) {
        if (bucket[j](data) === false) {
          return
        }
      }
    }
  }

  off(event: string, listener: ListenerHandler) {
    const buckets = this.listeners[event]

    if (!buckets) {
      return
    }

    for (let i = 0, lengthBuckets = buckets.length; i < lengthBuckets; i++) {
      const bucket = buckets[i]

      for (let j = 0, lengthBucket = bucket.length; j < lengthBucket; j++) {
        if (bucket[j] === listener) {
          bucket[j] = bucket[bucket.length - 1]
          bucket.pop()
          return
        }
      }
    }
  }

  clear(event?: string) {
    if (event) {
      delete this.listeners[event]
    } else {
      this.listeners = Object.create(null)
    }
  }
}
