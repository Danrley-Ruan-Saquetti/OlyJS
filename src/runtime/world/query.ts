import { Signature } from '../../ecs/archetype'
import { ComponentId } from '../../ecs/component'
import { Archetype } from './archetype'

export class QueryResult {

  constructor(
    private archetypes: Map<string, Archetype>,
    private ids: ComponentId[],
    private mask: Signature
  ) { }

  forEach(fn: (...components: unknown[]) => void) {
    for (const arch of this.archetypes.values()) {
      if ((arch.signature & this.mask) !== this.mask) {
        continue
      }

      const cols = this.ids.map(id => arch.columns[id as any])

      for (let i = 0; i < arch.size; i++) {
        fn(...cols.map(c => c.view(i)))
      }
    }
  }
}
