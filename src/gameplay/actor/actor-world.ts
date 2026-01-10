import { ComponentClass, IComponent } from '../../ecs/component'
import { EntityId } from '../../ecs/entity'
import { ActorContext } from '../../runtime/contracts/context/actor.context'
import { SystemContext } from '../../runtime/contracts/context/system.context'
import { IUpgradeable } from '../../runtime/contracts/upgradeable'
import { ActorClass, IActor } from './type'

export class ActorWorld {

  private readonly actors = new Map<EntityId, IActor>()
  private readonly components = new Map<EntityId, Map<ComponentClass, IComponent>>()

  private readonly actorsToAdd = new Map<EntityId, IActor>()
  private readonly actorsToDestroy = new Set<EntityId>()
  private readonly actorsToStart: IActor[] = []

  private readonly componentsToAdd: IComponent[] = []
  private readonly componentsToStart: IComponent[] = []
  private readonly componentsToUpdate = new Set<IUpgradeable>()

  private readonly actorContext: ActorContext = {
    instantiate: this.instantiate.bind(this),
    destroy: this.destroy.bind(this),
    addComponent: this.addComponent.bind(this),
    addComponents: this.addComponents.bind(this),
    getComponent: this.getComponent.bind(this),
  }

  private nextId = 1

  start() { }

  updateComponents(context: SystemContext) {
    for (const handler of this.componentsToUpdate) {
      handler.update(context)
    }
  }

  instantiate<ActorInstance extends IActor = IActor>(ActorClass: ActorClass<ActorInstance>) {
    const actor = new ActorClass(this.nextId++, this.actorContext)

    this.actorsToAdd.set(actor.id, actor)
    actor.init?.()

    return actor
  }

  addComponent<ComponentInstance extends IComponent = IComponent>(entityId: EntityId, ComponentClass: ComponentClass<ComponentInstance>): ComponentInstance {
    const actor = this.actors.get(entityId) ?? this.actorsToAdd.get(entityId)

    if (!actor) {
      return undefined as any as ComponentInstance
    }

    const component = new ComponentClass(actor)

    this.componentsToAdd.push(component)

    if (component.start) {
      this.componentsToStart.push(component)
    }

    return component
  }

  addComponents(entityId: EntityId, ComponentClasses: ComponentClass[]) {
    if (ComponentClasses.length == 0) {
      return
    }

    const actor = this.actors.get(entityId) ?? this.actorsToAdd.get(entityId)

    if (!actor) {
      return
    }

    let i = 0, length = ComponentClasses.length
    while (i < length) {
      const component = new ComponentClasses[i](actor)

      this.componentsToAdd.push(component)

      if (component.start) {
        this.componentsToStart.push(component)
      }
      i++
    }
  }

  getComponent<ComponentInstance extends IComponent = IComponent>(entityId: EntityId, ComponentClass: ComponentClass<ComponentInstance>) {
    return this.components.get(entityId)?.get(ComponentClass) as ComponentInstance
  }

  destroy(entityId: EntityId) {
    const actor = this.actors.get(entityId)

    if (!actor) {
      return
    }

    this.actorsToDestroy.add(actor.id)
  }

  flush() {
    this.flushActorsToAdd()
    this.flushActorsToDestroy()
    this.flushComponentsToUpdate()
    this.flushActorsToStart()
    this.flushComponentsToStart()
  }

  protected flushActorsToAdd() {
    if (this.actorsToAdd.size == 0) {
      return
    }

    for (const actor of this.actorsToAdd.values()) {
      this.actors.set(actor.id, actor)
      this.components.set(actor.id, new Map())

      if (actor.start) {
        this.actorsToStart.push(actor)
      }
    }

    this.actorsToAdd.clear()
  }

  protected flushActorsToDestroy() {
    if (this.actorsToDestroy.size == 0) {
      return
    }

    for (const entityId of this.actorsToDestroy) {
      for (const component of this.components.get(entityId)!.values()) {
        this.componentsToUpdate.delete(component as IUpgradeable)
      }

      this.actors.delete(entityId)
      this.components.delete(entityId)
    }

    this.actorsToDestroy.clear()
  }

  protected flushActorsToStart() {
    if (this.actorsToStart.length == 0) {
      return
    }

    let i = 0, length = this.actorsToStart.length
    while (i < length) {
      this.actorsToStart[i].start!()
      i++
    }

    this.actorsToStart.length = 0
  }

  protected flushComponentsToUpdate() {
    if (this.componentsToAdd.length == 0) {
      return
    }

    for (const component of this.componentsToAdd) {
      this.components.get(component.owner.id)?.set((component as any).constructor, component)

      if (component.update) {
        this.componentsToUpdate.add(component as IUpgradeable)
      }
    }

    this.componentsToAdd.length = 0
  }

  protected flushComponentsToStart() {
    if (this.componentsToStart.length == 0) {
      return
    }

    let i = 0, length = this.componentsToStart.length
    while (i < length) {
      this.componentsToStart[i].start!()
      i++
    }

    this.componentsToStart.length = 0
  }
}
