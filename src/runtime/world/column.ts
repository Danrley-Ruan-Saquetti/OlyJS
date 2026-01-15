import { ComponentSchema } from './component'

export class Column<T = any> {

  readonly id: bigint

  private data: T[] = []
  private schema: ComponentSchema<T>

  constructor(schema: ComponentSchema<T>, id: bigint) {
    this.schema = schema
    this.id = id
  }

  pushDefault() {
    this.data.push(this.schema.construct())
  }

  pop() {
    this.data.pop()
  }

  swap(indexA: number, indexB: number) {
    const temp = this.data[indexA]
    this.data[indexA] = this.data[indexB]
    this.data[indexB] = temp
  }

  copyFrom(other: Column<T>, index: number) {
    this.data.push(other.data[index])
  }

  view(index: number) {
    return this.data[index]
  }
}
