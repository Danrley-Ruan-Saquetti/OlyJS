import { ISystem } from '../ecs/system'
import { Engine } from '../engine/engine'
import { IEngine } from '../engine/types'
import { EventMap } from '../runtime/contracts/event'

export class Game<Events extends EventMap = {}> {

  private timeout: number
  private lastTime = 0

  protected engine: IEngine<Events> = new Engine<Events>()

  start() {
    if (this.engine.isRunning()) {
      return
    }

    this.initialize()
    this.engine.start()

    this.update(0)
  }

  protected initialize() { }

  stop() {
    if (!this.engine.isRunning()) {
      return
    }

    this.engine.stop()

    cancelAnimationFrame(this.timeout)
  }

  protected update = (timestamp: number) => {
    this.updateEngine(timestamp)
    this.timeout = requestAnimationFrame(this.update)
  }

  private updateEngine(timestamp: number) {
    const deltaTime = timestamp - this.lastTime

    this.engine.tick(deltaTime)

    this.lastTime = timestamp
  }

  registerSystem(system: ISystem<Events>) {
    this.engine.registerSystem(system)
  }
}
