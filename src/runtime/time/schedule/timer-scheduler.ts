import { MinHeap } from '../../../structures/min-heap'

export type ScheduleCallback = () => void

export interface TimerTask {
  executeAt: number
  seq: number
  callback: ScheduleCallback
}

export class TimerScheduler {

  private readonly heap = new MinHeap<TimerTask>(this.compareTasks.bind(this))

  private readonly active: TimerTask[] = []

  private seq = 1

  constructor(
    private readonly windowSize = 1
  ) { }

  schedule(callback: ScheduleCallback, delay: number, now: number) {
    this.heap.insert({
      executeAt: now + delay,
      seq: this.seq++,
      callback
    })
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
      task.callback()
    }
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
