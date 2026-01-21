import { ComponentSchema } from './component'

export interface IColumn<T = any> {
  pushDefault(): void
  pop(): void
  swap(indexA: number, indexB: number): void
  copyFrom(other: IColumn, index: number): void
  view(index: number): T
}

export class Column<T = any> implements IColumn<T> {

  private data: T[] = []
  private schema: ComponentSchema<T>

  constructor(schema: ComponentSchema<T>) {
    this.schema = schema
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

  copyFrom(other: IColumn, index: number) {
    const otherCol = other as Column<T>
    const value = otherCol.data[index]

    const copied = this.schema.clone
      ? this.schema.clone(value)
      : value

    this.data.push(copied)
  }

  view(index: number) {
    return this.data[index]
  }
}
