import { Signature } from '../../ecs/archetype'
import { ComponentId } from '../../ecs/component'
import { EntityId } from '../../ecs/entity'
import { IWorld } from '../../ecs/world'
import { CommandDomain } from '../../runtime/commands/command-domain'
import { Archetype } from './archetype'
import { ComponentDescriptor } from './component'
import { ComponentRegistry } from './component-registry'
import { EntityLocation } from './entity-location'
import { QueryBuilder } from './query'

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
  private archetypes = new Map<string, Archetype>()
  private entityLocation = new Map<EntityId, EntityLocation>()

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

  instantiate(): EntityId {
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

  query() {
    return new QueryBuilder(this.archetypes)
  }

  private performCreateEntity(id: EntityId) {
    const empty = this.getOrCreateArchetype(0n)

    empty.entities.push(id)

    this.entityLocation.set(id, {
      archetype: empty,
      index: empty.size - 1
    })
  }

  private performDestroyEntity(entity: EntityId) {
    const loc = this.entityLocation.get(entity)

    if (!loc) {
      return
    }

    const { archetype, index } = loc

    const last = archetype.size - 1
    const lastEntity = archetype.entities[last]

    archetype.removeEntity(index)

    this.entityLocation.get(lastEntity)!.index = index
    this.entityLocation.delete(entity)
  }

  private performAddComponent({ entityId, componentId }: AddComponentPayload) {
    const loc = this.entityLocation.get(entityId)

    if (!loc) {
      return
    }

    const oldArch = loc.archetype
    const newSig = oldArch.signature | (1n << componentId)

    if (newSig === oldArch.signature) {
      return
    }

    const newArch = this.getOrCreateArchetype(newSig)

    this.moveEntity(entityId, loc, oldArch, newArch)
  }

  private moveEntity(entity: EntityId, loc: EntityLocation, from: Archetype, to: Archetype) {
    const newIndex = to.size
    to.entities.push(entity)

    for (const col of to.columns) {
      col.pushDefault()
    }

    for (let i = 0; i < from.columns.length; i++) {
      const fromCol = from.columns[i]
      const componentId = from.columnIds[i]
      const toColIdx = to.columnIds.indexOf(componentId)

      if (toColIdx >= 0) {
        const toCol = to.columns[toColIdx]
        toCol.copyFrom(fromCol, loc.index)
      }
    }

    this.removeFromArchetype(loc, from)

    this.entityLocation.set(entity, { archetype: to, index: newIndex })
  }

  private removeFromArchetype(loc: EntityLocation, arch: Archetype) {
    const { index } = loc
    const last = arch.size - 1
    const lastEntity = arch.entities[last]

    arch.removeEntity(index)
    this.entityLocation.get(lastEntity)!.index = index
  }

  private getOrCreateArchetype(signature: Signature) {
    const key = signature.toString()
    let archetype = this.archetypes.get(key)

    if (!archetype) {
      archetype = new Archetype(signature, this.componentRegistry)
      this.archetypes.set(key, archetype)
    }

    return archetype
  }
}
