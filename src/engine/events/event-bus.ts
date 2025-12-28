import { EventMap, EventPriority, ListenerHandler } from '../../runtime/contracts/event'
import { IEventBusPriority, ListenersMap } from './types'

export class EventBus<Events extends EventMap = {}> implements IEventBusPriority<Events> {

  protected listeners: ListenersMap<Events> = Object.create(null)

  on<E extends keyof Events>(event: E, listener: ListenerHandler<Events[E]>, priority = EventPriority.NORMAL) {
    let buckets = this.listeners[event]

    if (!buckets) {
      buckets = [[], [], []]

      this.listeners[event] = buckets
    }

    buckets[priority].push(listener)
  }

  emit<E extends keyof Events>(event: E, data: Events[E]) {
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

  off<E extends keyof Events>(event: E, listener: ListenerHandler<Events[E]>) {
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

  clear(event?: keyof Events) {
    if (event) {
      delete this.listeners[event]
    } else {
      this.listeners = Object.create(null)
    }
  }
}
