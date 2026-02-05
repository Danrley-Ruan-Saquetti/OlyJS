import { ScheduleCallback } from '../../runtime/time/schedule/timer-scheduler'

export interface IScheduler {
  scheduleOnce(callback: ScheduleCallback, delay: number): void
  scheduleRepeat(callback: ScheduleCallback, delay: number): void
}
