import { Signature } from '../../ecs/archetype'
import { ComponentId } from '../../ecs/component'
import { Archetype } from './archetype'
import { IColumn } from './column'
import { ComponentDescriptor } from './component'

type CompiledQuery = {
  archetype: Archetype
  columns: (IColumn | undefined)[]
  exec: (fn: (...components: unknown[]) => void) => void
}

export class QueryBuilder {

  private ids: ComponentId[] = []
  private mask: Signature = 0n

  private compiled: CompiledQuery[] = []

  constructor(
    private archetypes: Map<string, Archetype>
  ) { }

  with(component: ComponentDescriptor) {
    this.ids.push(component.id)
    this.mask |= 1n << component.id

    return this
  }

  build() {
    this.compiled.length = 0

    for (const arch of this.archetypes.values()) {
      if ((arch.signature & this.mask) !== this.mask) {
        continue
      }

      const columns: IColumn[] = []

      let i = 0, length = this.ids.length
      while (i < length) {
        const column = arch.getColumn(this.ids[i])

        if (column) {
          columns.push(column)
        }

        i++
      }

      const exec = this.compileExecutor(arch, columns)

      if (exec) {
        this.compiled.push({ archetype: arch, columns, exec })
      }
    }
  }

  forEach(fn: (...components: unknown[]) => void) {
    let i = 0, length = this.compiled.length
    while (i < length) {
      this.compiled[i].exec(fn)
      i++
    }
  }

  private compileExecutor(archetype: Archetype, columns: IColumn[]) {
    const cols = columns
    const columnLength = cols.length

    switch (columnLength) {
      case 0:
        return
      case 1:
        return (fn: (...components: unknown[]) => void) => {
          let i = 0, archetypeSize = archetype.size
          while (i < archetypeSize) {
            fn(cols[0].view(i))
            i++
          }
        }
      case 2:
        return (fn: (...components: unknown[]) => void) => {
          let i = 0, archetypeSize = archetype.size
          while (i < archetypeSize) {
            fn(
              cols[0].view(i),
              cols[1].view(i)
            )

            i++
          }
        }
      case 3:
        return (fn: (...components: unknown[]) => void) => {
          let i = 0, archetypeSize = archetype.size
          while (i < archetypeSize) {
            fn(
              cols[0].view(i),
              cols[1].view(i),
              cols[2].view(i)
            )

            i++
          }
        }
      default:
        return (fn: (...components: unknown[]) => void) => {
          let i = 0, archetypeSize = archetype.size
          while (i < archetypeSize) {
            fn(...cols.map(c => c.view(i)))
            i++
          }
        }
    }
  }
}
