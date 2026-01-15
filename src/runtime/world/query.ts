import { Signature } from '../../ecs/archetype'
import { ComponentId } from '../../ecs/component'
import { Archetype } from './archetype'
import { IColumn } from './column'

type CompiledQuery = {
  archetype: Archetype
  columns: (IColumn | undefined)[]
}

export class QueryResult {

  private compiled: CompiledQuery[] = []

  constructor(
    archetypes: Map<string, Archetype>,
    private ids: ComponentId[],
    private mask: Signature
  ) {
    for (const arch of archetypes.values()) {
      if ((arch.signature & this.mask) !== this.mask) {
        continue
      }

      const cols = this.ids.map(id => arch.getColumn(id))
      this.compiled.push({ archetype: arch, columns: cols })
    }
  }

  forEach(fn: (...components: unknown[]) => void) {
    for (const { archetype, columns } of this.compiled) {
      for (let i = 0; i < archetype.size; i++) {
        fn(...columns.map(c => c?.view(i)))
      }
    }
  }
}
