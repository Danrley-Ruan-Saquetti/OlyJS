import { EntityId } from '../../ecs/entity'
import { IComponentStorage } from './types'

export class ComponentStorage<T = unknown> implements IComponentStorage<T> {

  private storage = new Map<EntityId, T>()

  has(entity: EntityId) {
    return this.storage.has(entity)
  }

  get(entity: EntityId) {
    return this.storage.get(entity)
  }

  set(entity: EntityId, value: T) {
    this.storage.set(entity, value)
  }

  delete(entity: EntityId) {
    this.storage.delete(entity)
  }

  entities() {
    return this.storage.keys()
  }
}
