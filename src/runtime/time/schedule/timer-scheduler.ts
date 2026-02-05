import { MinHeap } from '../../../structures/min-heap'

export type ScheduleCallback = () => void

export interface TimerTask {
  executeAt: number
  interval?: number
  seq: number
  callback: ScheduleCallback
  cancelled?: boolean
}

export class TimerScheduler {

  private readonly heap = new MinHeap<TimerTask>(this.compareTasks.bind(this))

  private readonly active: TimerTask[] = []

  private seq = 1

  constructor(
    private readonly windowSize = 1
  ) { }

  scheduleOnce(callback: ScheduleCallback, delay: number, now: number) {
    const task: TimerTask = {
      executeAt: now + delay,
      seq: this.seq++,
      callback
    }

    this.heap.insert(task)

    return task
  }

  scheduleRepeat(callback: ScheduleCallback, interval: number, now: number) {
    const task: TimerTask = {
      executeAt: now + interval,
      interval,
      seq: this.seq++,
      callback
    }

    this.heap.insert(task)

    return task
  }

  cancel(task: TimerTask) {
    task.cancelled = true
  }

  update(now: number) {
    const windowLimit = now + this.windowSize

    while (this.heap.size > 0) {
      const next = this.heap.min()

      if (next.executeAt > windowLimit) {
        break
      }

      this.insertActive(this.heap.removeMin())
    }

    while (this.active.length > 0) {
      const task = this.active[0]

      if (task.executeAt > now) {
        break
      }

      this.active.shift()

      if (task.cancelled) {
        continue
      }

      task.callback()

      if (task.interval) {
        this.reschedule(task)
      }
    }
  }

  private reschedule(task: TimerTask) {
    task.executeAt += task.interval!
    task.seq = this.seq++

    this.heap.insert(task)
  }

  private insertActive(task: TimerTask) {
    let low = 0
    let high = this.active.length

    while (low < high) {
      const mid = (low + high) >> 1

      if (this.compareTasks(task, this.active[mid]) < 0) {
        high = mid
      } else {
        low = mid + 1
      }
    }

    this.active.splice(low, 0, task)
  }

  private compareTasks(taskA: TimerTask, taskB: TimerTask) {
    if (taskA.executeAt == taskB.executeAt) {
      return taskA.seq - taskB.seq
    }

    return taskA.executeAt - taskB.executeAt
  }
}
