import { ISystem } from '../ecs/system'
import { Engine } from '../engine/engine'
import { IEngine } from '../engine/types'
import { GameWorld } from '../runtime/world/game.world'
import { MutableSystemUpdateContext } from './mutable-system-update-context'
import { InputSystem } from './runtime-systems/input.system'
import { SchedulerSystem } from './runtime-systems/scheduler.system'
import { TimeTracker } from './time/time-tracker'
import { ITimerTracker } from './time/types'

export class Game {

  protected readonly engine: IEngine = new Engine()
  protected readonly world = new GameWorld()
  protected readonly clock: ITimerTracker = new TimeTracker()

  protected readonly systemContext = new MutableSystemUpdateContext()

  protected readonly inputSystem = new InputSystem()
  protected readonly schedulerSystem = new SchedulerSystem()

  private timeout: number
  private lastTime = 0

  constructor() {
    this.systemContext.time = this.clock.time
    this.systemContext.input = this.inputSystem.state

    this.engine.initialize({ world: this.world })
  }

  start() {
    if (this.engine.isRunning()) {
      return
    }

    this.initializeEngine()
    this.clock.reset()
    this.engine.start()
    this.initialize()

    this.update(0)
  }

  protected initializeEngine() {
    this.registerSystem(this.inputSystem)
    this.registerSystem(this.schedulerSystem)

    this.engine.registerCommandDomain(this.world)
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

    this.clock.advance(deltaTime)
    this.engine.tick(this.systemContext)

    this.lastTime = timestamp
  }

  registerSystem(system: ISystem) {
    this.engine.registerSystem(system)
  }
}
