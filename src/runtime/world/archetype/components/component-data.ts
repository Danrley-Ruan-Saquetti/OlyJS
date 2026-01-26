import { ComponentDataSchema, FieldArrayConstructor, IComponentData } from '../../../../ecs/archetype'
import { ComponentSchema } from '../../../../ecs/component'

export class ComponentData<TShape extends ComponentDataSchema = ComponentDataSchema> implements IComponentData<TShape> {

  private readonly fields: TShape

  private _size = 0
  private capacity = 0

  get size() { return this._size }
  get isFull() { return this._size >= this.capacity }
  get data() { return this.fields }

  constructor(private readonly schema: ComponentSchema, initialCapacity = 64) {
    const fields: any = {}

    for (const field in schema) {
      const type = schema[field]

      const ArrayConstructor = FieldArrayConstructor[type]

      fields[field] = new ArrayConstructor(initialCapacity)
    }

    this.capacity = initialCapacity
    this.fields = fields
  }

  pushDefault() {
    if (this.isFull) {
      this.grow()
    }

    for (const field in this.fields) {
      this.fields[field][this._size] = 0
    }

    this._size++
  }

  pop() {
    this._size--
  }

  swap(indexA: number, indexB: number) {
    for (const field in this.fields) {
      const items = this.fields[field]
      const temp = items[indexA]

      items[indexA] = items[indexB]
      items[indexB] = temp
    }
  }

  copyFrom(other: IComponentData<TShape>, index: number) {
    if (this.isFull) {
      this.grow()
    }

    for (const field in this.fields) {
      this.fields[field][this._size] = other.field(field)[index]
    }
    this._size++
  }

  field<Field extends keyof TShape = any>(field: Field) {
    return this.fields[field]
  }

  private grow() {
    const newCapacity = this.capacity * 3

    for (const field in this.fields) {
      const type = this.schema[field]
      const oldArray = this.fields[field]

      const ArrayConstructor = FieldArrayConstructor[type]

      const newArray = new ArrayConstructor(newCapacity)
      newArray.set(oldArray)

      this.fields[field] = newArray as any
    }

    this.capacity = newCapacity
  }
}
