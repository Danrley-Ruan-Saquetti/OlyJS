import { ScheduleCallback, TimerTask } from '../../runtime/time/schedule/timer-scheduler'

export interface IScheduler {
  scheduleOnce(callback: ScheduleCallback, delay: number): TimerTask
  scheduleRepeat(callback: ScheduleCallback, delay: number): TimerTask
  cancel(task: TimerTask): void
}
