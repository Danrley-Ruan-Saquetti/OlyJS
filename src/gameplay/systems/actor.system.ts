import { EngineContext } from '../../contracts/context/engine.context'
import { SystemContext } from '../../contracts/context/system.context'
import { ComponentClass, IComponent } from '../../ecs/component'
import { EntityId } from '../../ecs/entity'
import { EngineSystem } from '../../systems/system'
import { ActorWorld } from '../actor/actor-world'
import { ActorClass, IActor } from '../actor/type'

export class ActorSystem extends EngineSystem {

  constructor(
    private readonly actorWorld: ActorWorld
  ) {
    super()
  }

  initialize(context: EngineContext) {
    context.commands.register(this.actorWorld)
  }

  update(context: SystemContext) {
    this.actorWorld.update(context)
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
