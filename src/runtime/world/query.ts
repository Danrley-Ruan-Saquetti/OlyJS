import { IArchetype, Signature } from '../../ecs/archetype'
import { ComponentDescriptor } from './component'

export class Query {

  private mask: Signature = 0n

  private readonly matched: IArchetype[] = []

  constructor(
    private readonly archetypes: Map<string, IArchetype>,
    components: ComponentDescriptor[] = []
  ) {
    let i = 0, length = components.length
    while (i < length) {
      this.mask |= 1n << components[i].id
      i++
    }
  }

  onArchetypeAdded(archetype: IArchetype) {
    if ((archetype.signature & this.mask) !== this.mask) {
      return
    }

    this.matched.push(archetype)
  }

  build() {
    this.matched.length = 0

    for (const archetype of this.archetypes.values()) {
      if ((archetype.signature & this.mask) !== this.mask) {
        continue
      }

      this.matched.push(archetype)
    }
  }

  view(): readonly IArchetype[] {
    return this.archetypes as any
  }
}
