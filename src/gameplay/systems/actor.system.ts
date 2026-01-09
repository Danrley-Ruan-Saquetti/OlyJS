import { ComponentClass, IComponent } from '../../ecs/component'
import { EntityId } from '../../ecs/entity'
import { SystemContext } from '../../runtime/contracts/context/system.context'
import { EngineSystem } from '../../systems/system'
import { ActorWorld } from '../actor/actor-world'
import { ActorClass, IActor } from '../actor/type'

export class ActorSystem extends EngineSystem {

  constructor(
    private readonly actorWorld: ActorWorld
  ) {
    super()
  }

  start() {
    this.actorWorld.start()
  }

  update(context: SystemContext) {
    this.actorWorld.updateComponents(context)
    this.actorWorld.flush()
  }

  instantiate<ActorInstance extends IActor = IActor>(ActorClass: ActorClass<ActorInstance>) {
    return this.actorWorld.instantiate(ActorClass)
  }

  addComponent<ComponentInstance extends IComponent = IComponent>(entityId: EntityId, ComponentClass: ComponentClass<ComponentInstance>) {
    return this.actorWorld.addComponent(entityId, ComponentClass)
  }

  getComponent<ComponentInstance extends IComponent = IComponent>(entityId: EntityId, ComponentClass: ComponentClass<ComponentInstance>) {
    return this.actorWorld.getComponent(entityId, ComponentClass)
  }

  destroy(entity: EntityId) {
    this.actorWorld.destroy(entity)
  }
}
