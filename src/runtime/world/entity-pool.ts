import { EntityId } from './../../ecs/entity'

export class EntityPool {

  private nextId: EntityId = 1
  private freeIds: EntityId[] = []

  create() {
    return this.freeIds.length
      ? this.freeIds.pop()!
      : this.nextId++
  }

  destroy(entityId: EntityId) {
    this.freeIds.push(entityId)
  }
}
