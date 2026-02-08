import { IArchetype } from '../../../ecs/archetype'
import { ComponentIdentifier } from '../../../ecs/component'
import { IQuery } from '../../../ecs/query'
import { IWorld } from '../../../ecs/world'
import { createSignature } from '../archetype/create-signature'
import { Query } from './query'

export class QueryManager {

  private readonly queries = new Map<string, IQuery>()

  constructor(
    private readonly world: IWorld
  ) { }

  getOrCreateQuery(components: ComponentIdentifier[]) {
    const signature = createSignature(components)
    const key = signature.toString()

    let query = this.queries.get(key)

    if (query) {
      return query
    }

    query = new Query()
    query.build(this.world.getArchetypes())

    return query
  }

  onArchetypeCreated(archetype: IArchetype) {
    for (const query of this.queries.values()) {
      query.onArchetypeAdded(archetype)
    }
  }
}
