import { ComponentClass, IComponent } from '../ecs/component'
import { EntityId } from '../ecs/entity'
import { ISystem } from '../ecs/system'
import { Engine } from '../engine/engine'
import { IEngine } from '../engine/types'
import { ActorWorld } from '../gameplay/actor/actor-world'
import { ActorClass, IActor } from '../gameplay/actor/type'
import { ActorSystem } from '../gameplay/systems/actor.system'
import { DefaultWorld } from '../runtime/world/default-world'
import { InputSystem } from '../systems/input.system'
import { MutableSystemContext } from './mutable-system-context'
import { TimeTracker } from './time/time-tracker'
import { ITimerTracker } from './time/types'

export class Game {

  protected engine: IEngine = new Engine()

  protected readonly world = new DefaultWorld()
  protected readonly actorWorld = new ActorWorld()

  protected readonly actorSystem = new ActorSystem(this.actorWorld)
  protected readonly inputSystem = new InputSystem()

  protected readonly clock: ITimerTracker = new TimeTracker()

  protected readonly systemContext = new MutableSystemContext()

  private timeout: number
  private lastTime = 0

  constructor() {
    this.systemContext.world = this.world
    this.systemContext.time = this.clock.time
    this.systemContext.input = this.inputSystem.state
    this.systemContext.events = {
      send: this.engine.context.events.send.bind(this.engine),
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
    this.registerSystem(this.actorSystem)
    this.registerSystem(this.inputSystem)
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

  registerSystem(system: ISystem) {
    this.engine.registerSystem(system)
  }

  instantiate<ActorInstance extends IActor = IActor>(ActorClass: ActorClass<ActorInstance>) {
    return this.actorSystem.instantiate(ActorClass)
  }

  addComponent<ComponentInstance extends IComponent = IComponent>(entityId: EntityId, ComponentClass: ComponentClass<ComponentInstance>) {
    return this.actorSystem.addComponent(entityId, ComponentClass)
  }
}
