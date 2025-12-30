import { SystemContext } from '../runtime/contracts/system-context'
import { ScheduleCallback, TimerScheduler } from '../runtime/time/schedule/timer-scheduler'
import { EngineSystem } from './system'

export class SchedulerSystem extends EngineSystem {

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
