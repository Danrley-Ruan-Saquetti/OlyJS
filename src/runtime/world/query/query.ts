import { IArchetype, Signature } from '../../../ecs/archetype'
import { ComponentIdentifier } from '../../../ecs/component'
import { EntityId } from '../../../ecs/entity'
import { createSignature } from '../archetype/create-signature'
import { IQuery } from './../../../ecs/query'

export class Query implements IQuery {

  readonly mask: Signature = 0n

  private readonly matched: IArchetype[] = []

  constructor(
    components: ComponentIdentifier[] = []
  ) {
    this.mask = createSignature(components)
  }

  onArchetypeAdded(archetype: IArchetype) {
    if ((archetype.signature & this.mask) !== this.mask) {
      return
    }

    this.matched.push(archetype)
  }

  build(archetypes: MapIterator<IArchetype>) {
    this.matched.length = 0

    for (const archetype of archetypes) {
      if ((archetype.signature & this.mask) !== this.mask) {
        continue
      }

      this.matched.push(archetype)
    }
  }

  view() {
    return this.matched as readonly IArchetype[]
  }

  find(max?: number) {
    if (max) {
      return this.findLimited(max)
    }

    return this.findAll()
  }

  findFirst() {
    let i = 0, length = this.matched.length
    while (i < length) {
      if (this.matched[i].size) {
        return this.matched[i].entities[0]
      }

      i++
    }

    return undefined
  }

  count() {
    let count = 0

    let i = 0, length = this.matched.length
    while (i < length) {
      count += this.matched[i].size
      i++
    }

    return count
  }

  isEmpty() {
    let i = 0, length = this.matched.length
    while (i < length) {
      if (this.matched[i].size) {
        return false
      }

      i++
    }

    return true
  }

  private findAll() {
    const entitiesId: EntityId[] = []

    let i = 0, length = this.matched.length
    while (i < length) {
      const entities = this.matched[i].entities

      let j = 0, size = this.matched[i].size
      while (j < size) {
        entitiesId.push(entities[j])

        j++
      }

      i++
    }

    return entitiesId
  }

  private findLimited(max: number) {
    const entitiesId: EntityId[] = []

    let i = 0, length = this.matched.length
    while (i < length) {
      const entities = this.matched[i].entities

      let j = 0, size = this.matched[i].size
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
