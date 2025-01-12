import { Timer } from './timer.js'

export class DeltaTime extends Timer {

  get FPS() {
    const deltaTimeSeconds = this.elapsedTimeSeconds
    return deltaTimeSeconds > 0 ? Math.round(1 / deltaTimeSeconds) : 0
  }
}