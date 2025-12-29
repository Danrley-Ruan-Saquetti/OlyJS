import { ComponentClass, IComponent, } from '../../ecs/component'
import { EntityId, } from '../../ecs/entity'
import { IWorld } from '../../ecs/world'
import { EngineContext } from '../../runtime/contracts/engine-context'
import { SystemContext } from '../../runtime/contracts/system-context'
import { IUpgradeable } from '../../runtime/contracts/upgradeable'
import { ActorClass, IActor } from './type'

export class ActorWorld {

  private world: IWorld

  private actors = new Map<EntityId, IActor>()
  private components = new Map<EntityId, Map<ComponentClass, IComponent>>()

  private pendingActors = new Map<EntityId, IActor>()
  private pendingComponents: IComponent[] = []

  private nextId = 1

  private requestedFlushActor = false
  private requestedFlushComponent = false

  private componentsToUpgrade: IUpgradeable[] = []

  initialize(context: EngineContext) {
    this.world = context.world
  }

  start() {
    this.requestedFlushActor = false
    this.requestedFlushComponent = false
  }

  updateComponents(context: SystemContext) {
    for (const handler of this.componentsToUpgrade) {
      handler.update(context)
    }
  }

  instantiate<ActorInstance extends IActor = IActor>(ActorClass: ActorClass<ActorInstance>) {
    const actor = new ActorClass(this.nextId++, this.world)

    this.pendingActors.set(actor.id, actor)
    this.requestedFlushActor = true

    return actor
  }

  addComponent<ComponentInstance extends IComponent = IComponent>(entityId: EntityId, ComponentClass: ComponentClass<ComponentInstance>): ComponentInstance {
    const actor = this.actors.get(entityId) ?? this.pendingActors.get(entityId)

    if (!actor) {
      return undefined as any as ComponentInstance
    }

    const component = new ComponentClass(actor)

    this.pendingComponents.push(component)
    this.requestedFlushComponent = true

    return component
  }

  getComponent<ComponentInstance extends IComponent = IComponent>(entityId: EntityId, ComponentClass: ComponentClass<ComponentInstance>) {
    return this.components.get(entityId)?.get(ComponentClass) as ComponentInstance
  }

  destroy(entityId: EntityId) {
    this.actors.delete(entityId)
    this.components.delete(entityId)
  }

  flushActors() {
    if (!this.requestedFlushActor) {
      return
    }

    for (const actor of this.pendingActors.values()) {
      this.actors.set(actor.id, actor)
      this.components.set(actor.id, new Map())
    }

    this.pendingActors.clear()
    this.requestedFlushActor = false
  }

  flushComponents() {
    if (!this.requestedFlushComponent) {
      return
    }

    for (const component of this.pendingComponents) {
      this.components.get(component.owner.id)?.set((component as any).constructor, component)
    }

    this.pendingComponents.length = 0
    this.requestedFlushComponent = false
  }
}
