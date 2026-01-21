import { Signature } from '../../ecs/archetype'
import { ComponentId } from '../../ecs/component'
import { EntityId } from '../../ecs/entity'
import { IWorld } from '../../ecs/world'
import { CommandDomain } from '../../runtime/commands/command-domain'
import { Archetype } from './archetype/archetype'
import { EntityLocation } from './archetype/entity-location'
import { ComponentDescriptor } from './component'
import { ComponentRegistry } from './component-registry'
import { Query } from './query'

export enum GameWorldCommand {
  CREATE_ENTITY = 'entity:create',
  DESTROY_ENTITY = 'entity:destroy',
  ADD_COMPONENT = 'component:add'
}

export enum GameWorldCommandPhase {
  CREATE_ENTITY,
  DESTROY_ENTITY,
  ADD_COMPONENT
}

interface AddComponentPayload {
  entityId: EntityId
  componentId: ComponentId
}

export class GameWorld implements IWorld {

  protected readonly commandDomain = new CommandDomain(Object.keys(GameWorldCommandPhase).length)
  protected readonly componentRegistry = new ComponentRegistry()

  private nextEntityId = 1
  private readonly archetypes = new Map<string, Archetype>()
  private readonly entityLocation = new Map<EntityId, EntityLocation>()

  private readonly queries: Query[] = []

  constructor() {
    this.commandDomain.register(
      GameWorldCommand.CREATE_ENTITY,
      this.performCreateEntity.bind(this),
      GameWorldCommandPhase.CREATE_ENTITY
    )
    this.commandDomain.register(
      GameWorldCommand.DESTROY_ENTITY,
      this.performDestroyEntity.bind(this),
      GameWorldCommandPhase.DESTROY_ENTITY
    )
    this.commandDomain.register(
      GameWorldCommand.ADD_COMPONENT,
      this.performAddComponent.bind(this),
      GameWorldCommandPhase.ADD_COMPONENT
    )
  }

  registerComponent(descriptor: ComponentDescriptor) {
    this.componentRegistry.register(descriptor)
  }

  flush() {
    this.commandDomain.flush()
  }

  instantiate() {
    const id = this.nextEntityId++
    this.commandDomain.send(GameWorldCommand.CREATE_ENTITY, id)

    return id
  }

  destroy(entityId: EntityId) {
    this.commandDomain.send(GameWorldCommand.DESTROY_ENTITY, entityId)
  }

  addComponent(entityId: EntityId, component: ComponentDescriptor) {
    this.commandDomain.send(GameWorldCommand.ADD_COMPONENT, { entity: entityId, component: component.id })
  }

  createQuery(components: ComponentDescriptor[]) {
    const query = new Query(this.archetypes, components)
    this.queries.push(query)

    query.build()

    return query
  }

  private performCreateEntity(entityId: EntityId) {
    const emptyArchetype = this.getOrCreateArchetype(0n)

    emptyArchetype.addEntity(entityId)

    this.entityLocation.set(entityId, {
      archetype: emptyArchetype,
      index: emptyArchetype.size - 1
    })
  }

  private performDestroyEntity(entity: EntityId) {
    const location = this.entityLocation.get(entity)

    if (!location) {
      return
    }

    const { archetype, index } = location
    const lastEntity = archetype.lastEntity

    archetype.removeEntity(index)

    this.entityLocation.get(lastEntity)!.index = index
    this.entityLocation.delete(entity)
  }

  private performAddComponent({ entityId, componentId }: AddComponentPayload) {
    const location = this.entityLocation.get(entityId)

    if (!location) {
      return
    }

    const oldArchetype = location.archetype
    const newSignature = oldArchetype.signature | (1n << componentId)

    if (newSignature === oldArchetype.signature) {
      return
    }

    const newArch = this.getOrCreateArchetype(newSignature)

    this.moveEntity(entityId, location, oldArchetype, newArch)
  }

  private moveEntity(entity: EntityId, location: EntityLocation, from: Archetype, to: Archetype) {
    to.addEntityFrom(entity, location.index, to)
    this.removeFromArchetype(location, from)

    this.entityLocation.set(entity, { archetype: to, index: to.size - 1 })
  }

  private removeFromArchetype(location: EntityLocation, archetype: Archetype) {
    const { index } = location
    const lastEntity = archetype.lastEntity

    archetype.removeEntity(index)
    this.entityLocation.get(lastEntity)!.index = index
  }

  private getOrCreateArchetype(signature: Signature) {
    const key = signature.toString()
    let archetype = this.archetypes.get(key)

    if (!archetype) {
      archetype = new Archetype(signature, this.componentRegistry)

      this.archetypes.set(key, archetype)
      this.onArchetypeCreated(archetype)
    }

    return archetype
  }

  private onArchetypeCreated(archetype: Archetype) {
    let i = 0, length = this.queries.length
    while (i < length) {
      this.queries[i].onArchetypeAdded(archetype)
      i++
    }
  }
}
