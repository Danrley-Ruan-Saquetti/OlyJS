import { DeltaTime } from '@runtime/contracts/time'

export class Clock {

  protected lastTime = 0
  protected totalElapsedTime = 0
  protected deltaTime = 0

  protected state: DeltaTime = {
    deltaTime: 0,
    deltaTimeSeconds: 0,
    totalElapsedTime: 0,
  }

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

    this.updateState()
  }

  private updateState() {
    this.state.deltaTime = this.deltaTime
    this.state.deltaTimeSeconds = this.deltaTime / 1000
    this.state.totalElapsedTime = this.totalElapsedTime
  }

  getState(): DeltaTime {
    return this.state
  }
}
