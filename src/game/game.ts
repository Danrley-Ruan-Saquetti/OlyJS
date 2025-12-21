import { IEngine } from '../engine'
import { EventMap } from '../runtime'

export class Game<Events extends EventMap = {}> {

  private timeout: number
  private lastTime = 0

  constructor(
    protected engine: IEngine<Events>
  ) { }

  start() {
    this.engine.start()

    this.update(0)
  }

  stop() {
    this.engine.stop()

    cancelAnimationFrame(this.timeout)
  }

  protected update = (timestamp: number) => {
    const deltaTime = timestamp - this.lastTime

    this.engine.tick(deltaTime)

    this.lastTime = timestamp
    this.timeout = requestAnimationFrame(this.update)
  }
}
