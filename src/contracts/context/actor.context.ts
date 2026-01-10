import { ComponentClass, IComponent } from '../../ecs/component'
import { EntityId } from '../../ecs/entity'
import { ActorClass, IActor } from '../../gameplay/actor/type'

export interface ActorContext {
  instantiate<ActorInstance extends IActor = IActor>(ActorClass: ActorClass<ActorInstance>): void
  destroy(entityId: EntityId): void

  addComponent<ComponentInstance extends IComponent = IComponent>(entityId: EntityId, ComponentClass: ComponentClass<ComponentInstance>): ComponentInstance
  addComponents(entityId: EntityId, ComponentClasses: ComponentClass[]): void
  getComponent<ComponentInstance extends IComponent = IComponent>(entityId: EntityId, ComponentClass: ComponentClass<ComponentInstance>): ComponentInstance
}
