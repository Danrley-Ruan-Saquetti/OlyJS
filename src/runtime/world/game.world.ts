import { IArchetype, Signature } from '../../ecs/archetype'
import { ComponentDescriptor, ComponentId, ComponentsToObject } from '../../ecs/component'
import { EntityId } from '../../ecs/entity'
import { IWorld } from '../../ecs/world'
import { CommandDomain } from '../../runtime/commands/command-domain'
import { Archetype } from './archetype/archetype'
import { EntityLocation } from './archetype/entity-location'
import { GlobalComponentRegistry } from './component-registry'
import { EntityBuilder } from './entity-builder'
import { EntityPool } from './entity-pool'
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

interface AddEntityWithComponentsPayload {
  entityId: EntityId
  components: { componentId: ComponentId, data?: unknown }[]
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

  instantiate(components?: { component: ComponentDescriptor, data?: unknown }[]) {
    const id = this.entityPool.create()

    if (!components) {
      this.commandDomain.send(GameWorldCommand.CREATE_ENTITY, id)

      return id
    }

    this.commandDomain.send(GameWorldCommand.CREATE_ENTITY_WITH_COMPONENTS, {
      entityId: id,
      components: components.map(component => ({
        componentId: component.component.id,
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

  createPrefab() {
    return new EntityBuilder(this)
  }

  createQuery(components: ComponentId[]) {
    const query = new Query(this.archetypes, components)
    this.queries.push(query)

    query.build()

    return query
  }

  getEntity(entityId: EntityId) {
    return this.entityLocation.get(entityId)!
  }

  private performCreateEntity(entityId: EntityId) {
    const emptyArchetype = this.getOrCreateArchetype(0n)

    emptyArchetype.addEntity(entityId)

    this.entityLocation.set(entityId, {
      archetype: emptyArchetype,
      index: emptyArchetype.size - 1
    })
  }

  private performCreateEntityWithComponents({ entityId, components }: AddEntityWithComponentsPayload) {
    let signature = 0n
    let initialData: Record<number, any> = {}

    let i = 0, length = components.length
    while (i < length) {
      signature |= 1n << components[i].componentId

      if (components[i].data !== undefined) {
        initialData[components[i].componentId as any] = components[i].data
      }

      i++
    }

    const emptyArchetype = this.getOrCreateArchetype(signature)

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

  private getOrCreateArchetype(signature: Signature) {
    const key = signature.toString()
    let archetype = this.archetypes.get(key)

    if (!archetype) {
      archetype = new Archetype(signature, GlobalComponentRegistry)

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
}
