import { ScheduleCallback } from '../../runtime/time/schedule/timer-scheduler'

export interface IScheduler {
  schedule(callback: ScheduleCallback, delay: number): void
}
