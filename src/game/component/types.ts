import { EntityId } from '../../ecs/entity'

export interface IComponentStorage<T = any> {
  has(entity: EntityId): boolean
  get(entity: EntityId): T | undefined
  set(entity: EntityId, value: T): void
  delete(entity: EntityId): void
  entities(): Iterable<EntityId>
}
