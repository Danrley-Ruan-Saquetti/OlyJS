import { IArchetype, Signature } from '../../../ecs/archetype'
import { ComponentIdentifier } from '../../../ecs/component'
import { createSignature } from '../archetype/create-signature'

export class Query {

  private readonly mask: Signature = 0n

  private readonly matched: IArchetype[] = []

  constructor(
    private readonly archetypes: Map<string, IArchetype>,
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

  build() {
    this.matched.length = 0

    for (const archetype of this.archetypes.values()) {
      if ((archetype.signature & this.mask) !== this.mask) {
        continue
      }

      this.matched.push(archetype)
    }
  }

  view() {
    return this.matched as readonly IArchetype[]
  }
}
