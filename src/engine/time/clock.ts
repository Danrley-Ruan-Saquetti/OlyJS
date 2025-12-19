import { DeltaTime } from '@runtime/contracts/time'

export class Clock {

  protected lastTime = 0
  protected totalElapsedTime = 0
  protected deltaTime = 0

  constructor() {
    this.lastTime = performance.now()
  }

  reset() {
    this.lastTime = performance.now()
    this.totalElapsedTime = 0
  }

  tick() {
    const currentTime = performance.now()

    this.deltaTime = currentTime - this.lastTime
    this.totalElapsedTime += this.deltaTime
    this.lastTime = currentTime
  }

  getState(): DeltaTime {
    return {
      deltaTime: this.deltaTime,
      deltaTimeSeconds: this.deltaTime / 1000,
      totalElapsedTime: this.totalElapsedTime,
    }
  }
}
