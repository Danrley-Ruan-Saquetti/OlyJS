import { ComponentClass, IComponent } from '../../ecs/component'
import { EntityId } from '../../ecs/entity'
import { CommandDomain } from '../../runtime/commands/command-domain'
import { ICommandDomain } from '../../runtime/contracts/command'
import { ActorContext } from '../../runtime/contracts/context/actor.context'
import { ComponentContext } from '../../runtime/contracts/context/component.context'
import { ActorClass, IActor } from './type'

export enum ActorWorldCommand {
  ACTOR_ADD = 'actor:add',
  ACTOR_DESTROY = 'actor:destroy',
  ACTOR_START = 'actor:start',
  COMPONENT_ADD = 'component:add',
  COMPONENT_START = 'component:start'
}

export enum ActorWorldCommandPhase {
  ACTOR_ADD,
  ACTOR_DESTROY,
  COMPONENT_ADD,
  ACTOR_START,
  COMPONENT_START
}

export class ActorWorld implements ICommandDomain {

  private readonly actors = new Map<EntityId, IActor>()
  private readonly components = new Map<EntityId, Map<ComponentClass, IComponent>>()

  protected readonly commandDomain = new CommandDomain(Object.keys(ActorWorldCommandPhase).length)

  private readonly actorsToAdd = new Map<EntityId, IActor>()
  private readonly componentsToUpdate = new Set<IComponent>()

  private readonly actorContext: ActorContext = {
    instantiate: this.instantiate.bind(this),
    destroy: this.destroy.bind(this),
    addComponent: this.addComponent.bind(this),
    addComponents: this.addComponents.bind(this),
    getComponent: this.getComponent.bind(this),
  }

  constructor() {
    this.commandDomain.register(ActorWorldCommand.ACTOR_ADD, this.performActorAdd.bind(this), ActorWorldCommandPhase.ACTOR_ADD)
    this.commandDomain.register(ActorWorldCommand.ACTOR_DESTROY, this.performActorDestroy.bind(this), ActorWorldCommandPhase.ACTOR_DESTROY)
    this.commandDomain.register(ActorWorldCommand.ACTOR_START, this.performActorStart.bind(this), ActorWorldCommandPhase.ACTOR_START)
    this.commandDomain.register(ActorWorldCommand.COMPONENT_ADD, this.performComponentAdd.bind(this), ActorWorldCommandPhase.COMPONENT_ADD)
    this.commandDomain.register(ActorWorldCommand.COMPONENT_START, this.performComponentStart.bind(this), ActorWorldCommandPhase.COMPONENT_START)
  }

  private nextId = 1

  update(componentContext: ComponentContext) {
    for (const handler of this.componentsToUpdate) {
      handler.update!(componentContext)
    }
  }

  flush() {
    this.commandDomain.flush()
  }

  instantiate<ActorInstance extends IActor = IActor>(ActorClass: ActorClass<ActorInstance>) {
    const actor = new ActorClass(this.nextId++, this.actorContext)

    this.commandDomain.send(ActorWorldCommand.ACTOR_ADD, actor)

    if (actor.start) {
      this.commandDomain.send(ActorWorldCommand.ACTOR_START, actor)
    }

    this.actorsToAdd.set(actor.id, actor)
    actor.init?.()

    return actor
  }

  destroy(entityId: EntityId) {
    const actor = this.actors.get(entityId)

    if (!actor) {
      return
    }

    this.commandDomain.send(ActorWorldCommand.ACTOR_DESTROY, actor.id)
  }

  addComponent<ComponentInstance extends IComponent = IComponent>(entityId: EntityId, ComponentClass: ComponentClass<ComponentInstance>): ComponentInstance {
    const actor = this.actors.get(entityId) ?? this.actorsToAdd.get(entityId)

    if (!actor) {
      return undefined as any as ComponentInstance
    }

    const component = new ComponentClass(actor)

    this.commandDomain.send(ActorWorldCommand.COMPONENT_ADD, component)
    component.init?.()

    if (component.start) {
      this.commandDomain.send(ActorWorldCommand.COMPONENT_START, component)
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

      this.commandDomain.send(ActorWorldCommand.COMPONENT_ADD, component)
      component.init?.()

      if (component.start) {
        this.commandDomain.send(ActorWorldCommand.COMPONENT_START, component)
      }
      i++
    }
  }

  getComponent<ComponentInstance extends IComponent = IComponent>(entityId: EntityId, ComponentClass: ComponentClass<ComponentInstance>) {
    return this.components.get(entityId)?.get(ComponentClass) as ComponentInstance
  }

  protected performActorAdd(actor: IActor) {
    this.actors.set(actor.id, actor)
    this.components.set(actor.id, new Map())

    this.actorsToAdd.delete(actor.id)
  }

  protected performActorDestroy(entityId: EntityId) {
    for (const component of this.components.get(entityId)!.values()) {
      this.componentsToUpdate.delete(component)
    }

    this.actors.delete(entityId)
    this.components.delete(entityId)
  }

  protected performActorStart(actor: IActor) {
    actor.start!()
  }

  protected performComponentAdd(component: IComponent) {
    this.components.get(component.owner.id)?.set((component as any).constructor, component)

    if (component.update) {
      this.componentsToUpdate.add(component)
    }
  }

  protected performComponentStart(component: IComponent) {
    component.start!()
  }
}
