import { SystemUpdateContext } from '../../contracts/context/system.context'
import { System } from '../../runtime/systems/system'
import { ScheduleCallback, TimerScheduler, TimerTask } from '../../runtime/time/schedule/timer-scheduler'

export class SchedulerSystem extends System {

  private scheduler = new TimerScheduler()

  private elapsedTime = 0

  update(context: SystemUpdateContext) {
    this.elapsedTime = context.time.totalElapsedTimeMilliseconds
    this.scheduler.update(context.time.totalElapsedTimeMilliseconds)
  }

  scheduleOnce(callback: ScheduleCallback, delay: number) {
    return this.scheduler.scheduleOnce(callback, delay, this.elapsedTime)
  }

  scheduleRepeat(callback: ScheduleCallback, interval: number) {
    return this.scheduler.scheduleRepeat(callback, interval, this.elapsedTime)
  }

  cancel(task: TimerTask) {
    return this.scheduler.cancel(task)
  }
}
