import { IColumn } from '../../../ecs/archetype'

export class Float32Column implements IColumn {

  private data: Float32Array
  private size = 0

  constructor(initialCapacity = 1024) {
    this.data = new Float32Array(initialCapacity)
  }

  pushDefault() {
    this.ensureCapacity()

    this.data[this.size] = 0
    this.size++
  }

  pop() {
    if (this.size > 0) {
      this.size--
    }
  }

  swap(indexA: number, indexB: number) {
    const temp = this.data[indexA]
    this.data[indexA] = this.data[indexB]
    this.data[indexB] = temp
  }

  copyFrom(other: IColumn, index: number) {
    const otherCol = other as Float32Column

    this.ensureCapacity()

    this.data[this.size] = otherCol.data[index]
    this.size++
  }

  view(index: number) {
    return this.data[index]
  }

  private ensureCapacity() {
    if (this.size >= this.data.length) {
      const newCapacity = Math.ceil(this.data.length * 1.5)
      const newData = new Float32Array(newCapacity)

      newData.set(this.data)
      this.data = newData
    }
  }

  getBuffer(): Float32Array {
    return this.data.slice(0, this.size)
  }

  getSize(): number {
    return this.size
  }
}
