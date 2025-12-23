import { ISystem } from '../ecs/system'
import { World } from '../ecs/world'
import { Engine } from '../engine/engine'
import { IEngine } from '../engine/types'
import { EventMap } from '../runtime/contracts/event'
import { InputSystem } from '../systems/input.system'
import { MutableSystemContext } from './mutable-system-context'
import { TimeTracker } from './time/time-tracker'
import { ITimerTracker } from './time/types'

export class Game<Events extends EventMap = {}> {

  protected engine: IEngine<Events> = new Engine<Events>()

  protected readonly world = new World()

  protected readonly clock: ITimerTracker = new TimeTracker()
  protected readonly input = new InputSystem()

  protected readonly systemContext = new MutableSystemContext<Events>()

  private timeout: number
  private lastTime = 0

  constructor() {
    this.systemContext.world = this.world
    this.systemContext.time = this.clock.time
    this.systemContext.input = this.input.state
    this.systemContext.events = {
      send: this.engine.send.bind(this.engine),
    }
  }

  start() {
    if (this.engine.isRunning()) {
      return
    }

    this.initialize()
    this.clock.reset()
    this.engine.start({ world: this.world })

    this.update(0)
  }

  protected initialize() {
    this.registerSystem(this.input)
  }

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

  registerSystem(system: ISystem<Events>) {
    this.engine.registerSystem(system)
  }
}
