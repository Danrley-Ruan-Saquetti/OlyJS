import { ArchetypeProfile, IArchetype, Signature } from '../../ecs/archetype'
import { ComponentDescriptor, ComponentId, ComponentIdentifier, ComponentsToObject } from '../../ecs/component'
import { EntityId } from '../../ecs/entity'
import { IWoldSpawnProperties, IWorld } from '../../ecs/world'
import { CommandDomain } from '../commands/command-domain'
import { Archetype } from './archetype/archetype'
import { createSignature } from './archetype/create-signature'
import { EntityLocation } from './archetype/entity-location'
import { GlobalComponentRegistry } from './component-registry'
import { EntityBuilder } from './entity-builder'
import { EntityPool } from './entity-pool'
import { PrefabEntityProperties } from './prefab-entity'
import { Query } from './query'

export enum GameWorldCommand {
  CREATE_ENTITY = 'entity:create',
  CREATE_ENTITY_WITH_COMPONENTS = 'entity:create-with-components',
  DESTROY_ENTITY = 'entity:destroy',
  ADD_COMPONENT = 'component:add'
}

export enum GameWorldCommandPhase {
  CREATE_ENTITY,
  CREATE_ENTITY_WITH_COMPONENTS,
  DESTROY_ENTITY,
  ADD_COMPONENT
}

interface AddEntityPayload {
  entityId: EntityId
  profile?: ArchetypeProfile
}

interface AddEntityWithComponentsPayload {
  entityId: EntityId
  profile?: ArchetypeProfile
  components: (ComponentIdentifier & { data?: unknown })[]
}

interface AddComponentPayload {
  entityId: EntityId
  componentId: ComponentId
  data?: any
}

export class GameWorld implements IWorld {

  protected readonly commandDomain = new CommandDomain(Object.keys(GameWorldCommandPhase).length)

  private readonly archetypes = new Map<string, IArchetype>()
  private readonly entityLocation = new Map<EntityId, EntityLocation>()
  private readonly entityPool = new EntityPool()

  private readonly queries: Query[] = []

  constructor() {
    this.commandDomain.register(
      GameWorldCommand.CREATE_ENTITY,
      this.performCreateEntity.bind(this),
      GameWorldCommandPhase.CREATE_ENTITY
    )
    this.commandDomain.register(
      GameWorldCommand.CREATE_ENTITY_WITH_COMPONENTS,
      this.performCreateEntityWithComponents.bind(this),
      GameWorldCommandPhase.CREATE_ENTITY_WITH_COMPONENTS
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

  flush() {
    this.commandDomain.flush()
  }

  spawn({ components, profile }: IWoldSpawnProperties) {
    const id = this.entityPool.create()

    if (!components) {
      this.commandDomain.send(GameWorldCommand.CREATE_ENTITY, { entityId: id, profile })

      return id
    }

    this.commandDomain.send(GameWorldCommand.CREATE_ENTITY_WITH_COMPONENTS, {
      entityId: id,
      profile,
      components: components.map(component => ({
        id: component.component.id,
        data: component.data
      }))
    })

    return id
  }

  destroy(entityId: EntityId) {
    this.commandDomain.send(GameWorldCommand.DESTROY_ENTITY, entityId)
  }

  addComponent<TComponent extends ComponentDescriptor>(entityId: EntityId, component: TComponent, initialData?: ComponentsToObject<[TComponent]>) {
    this.commandDomain.send(GameWorldCommand.ADD_COMPONENT, { entityId, componentId: component.id, data: initialData })
  }

  createPrefab(properties?: PrefabEntityProperties) {
    return new EntityBuilder(this, properties)
  }

  createQuery(components: ComponentDescriptor[]) {
    const query = new Query(this.archetypes, components)
    this.queries.push(query)

    query.build()

    return query
  }

  findFirst(components: ComponentDescriptor[]) {
    const query = new Query(this.archetypes, components)
    query.build()

    const entitiesId = this.findFromQuery(query, 1)

    return entitiesId[0]
  }

  findSingleton(components: ComponentDescriptor[]) {
    const query = new Query(this.archetypes, components)
    query.build()

    const entitiesId = this.findFromQuery(query, 2)

    return entitiesId.length == 1 ? entitiesId[0] : undefined
  }

  expectSingleton(components: ComponentDescriptor[]) {
    const query = new Query(this.archetypes, components)
    query.build()

    const entitiesId = this.findFromQuery(query, 2)

    if (!entitiesId.length) {
      throw new Error(`Expect Singleton failed: no entity with components [${components.map(({ name }) => name).join(', ')}]`)
    }

    if (entitiesId.length > 1) {
      throw new Error(`Expect Singleton failed: more than one entity found with components [${components.map(({ name }) => name).join(', ')}]`)
    }

    return entitiesId[0]
  }

  getEntity(entityId: EntityId) {
    return this.entityLocation.get(entityId)!
  }

  private performCreateEntity({ entityId, profile }: AddEntityPayload) {
    const emptyArchetype = this.getOrCreateArchetype(0n, profile)

    emptyArchetype.addEntity(entityId)

    this.entityLocation.set(entityId, {
      archetype: emptyArchetype,
      index: emptyArchetype.size - 1
    })
  }

  private performCreateEntityWithComponents({ entityId, components, profile }: AddEntityWithComponentsPayload) {
    const signature = createSignature(components)
    let initialData: Record<number, any> = {}

    let i = 0, length = components.length
    while (i < length) {
      if (components[i].data !== undefined) {
        initialData[components[i].id as any] = components[i].data
      }

      i++
    }

    const emptyArchetype = this.getOrCreateArchetype(signature, profile)

    emptyArchetype.addEntity(entityId, initialData)

    this.entityLocation.set(entityId, {
      archetype: emptyArchetype,
      index: emptyArchetype.size - 1
    })
  }

  private performDestroyEntity(entityId: EntityId) {
    const location = this.entityLocation.get(entityId)

    if (!location) {
      return
    }

    const { archetype, index } = location
    const lastEntity = archetype.lastEntity

    archetype.removeEntity(index)

    this.entityLocation.get(lastEntity)!.index = index
    this.entityLocation.delete(entityId)
    this.entityPool.destroy(entityId)
  }

  private performAddComponent({ entityId, componentId, data }: AddComponentPayload) {
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

    const initialData = data !== undefined ? { [componentId as any]: data } : undefined

    this.moveEntity(entityId, location, oldArchetype, newArch, initialData)
  }

  private moveEntity(entityId: EntityId, location: EntityLocation, from: IArchetype, to: IArchetype, initialData?: Record<number, any>) {
    (to as Archetype).addEntityFrom(entityId, location.index, from as Archetype, initialData)
    this.removeFromArchetype(location, from)

    this.entityLocation.set(entityId, { archetype: to, index: to.size - 1 })
  }

  private removeFromArchetype(location: EntityLocation, archetype: IArchetype) {
    const { index } = location
    const lastEntity = archetype.lastEntity

    archetype.removeEntity(index)
    this.entityLocation.get(lastEntity)!.index = index
  }

  private getOrCreateArchetype(signature: Signature, profile?: ArchetypeProfile) {
    const key = signature.toString()
    let archetype = this.archetypes.get(key)

    if (!archetype) {
      archetype = new Archetype(signature, GlobalComponentRegistry)

      archetype.initialize(profile ?? ArchetypeProfile.COMMON)

      this.archetypes.set(key, archetype)
      this.onArchetypeCreated(archetype)
    }

    return archetype
  }

  private onArchetypeCreated(archetype: IArchetype) {
    let i = 0, length = this.queries.length
    while (i < length) {
      this.queries[i].onArchetypeAdded(archetype)
      i++
    }
  }

  private findFromQuery(query: Query, max: number): EntityId[] {
    const entitiesId: EntityId[] = []
    const archetypes = query.view()

    let i = 0, length = archetypes.length
    while (i < length) {
      const entities = archetypes[i].entities

      let j = 0, size = entities.length
      while (j < size) {
        entitiesId.push(entities[j])

        if (entitiesId.length >= max) {
          return entitiesId
        }

        j++
      }

      i++
    }

    return entitiesId
  }
}
