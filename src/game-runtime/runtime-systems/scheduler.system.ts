import { SystemContext } from '../../contracts/context/system.context'
import { System } from '../../runtime/systems/system'
import { ScheduleCallback, TimerScheduler } from '../../runtime/time/schedule/timer-scheduler'

export class SchedulerSystem extends System {

  private scheduler = new TimerScheduler()

  private elapsedTime = 0

  update(context: SystemContext) {
    this.elapsedTime = context.time.totalElapsedTimeMilliseconds
    this.scheduler.update(context.time.totalElapsedTimeMilliseconds)
  }

  schedule(callback: ScheduleCallback, delay: number) {
    this.scheduler.schedule(callback, delay, this.elapsedTime)
  }
}
