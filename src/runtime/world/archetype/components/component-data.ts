import { TypedArray } from '../../../../ecs/archetype'
import { ComponentDataSchema, ComponentFieldType, ComponentSchema, IComponentData } from '../../../../ecs/component'

type SchemaToData<Shape extends ComponentSchema = ComponentSchema> = {
  [K in keyof Shape]: FieldTypeToArray[Shape[K]]
}

const FieldArrayConstructor: Record<ComponentFieldType, new (initialCapacity?: number) => TypedArray> = {
  [ComponentFieldType.Int8]: Int8Array,
  [ComponentFieldType.Uint8]: Uint8Array,
  [ComponentFieldType.Uint8Clamped]: Uint8ClampedArray,
  [ComponentFieldType.Int16]: Int16Array,
  [ComponentFieldType.Uint16]: Uint16Array,
  [ComponentFieldType.Int32]: Int32Array,
  [ComponentFieldType.Uint32]: Uint32Array,
  [ComponentFieldType.Float16]: Float16Array,
  [ComponentFieldType.Float32]: Float32Array,
  [ComponentFieldType.Float64]: Float64Array,
  [ComponentFieldType.BigInt64]: BigInt64Array,
  [ComponentFieldType.BigUint64]: BigUint64Array,
} as const

type FieldTypeToArray = {
  [ComponentFieldType.Int8]: Int8Array,
  [ComponentFieldType.Uint8]: Uint8Array,
  [ComponentFieldType.Uint8Clamped]: Uint8ClampedArray,
  [ComponentFieldType.Int16]: Int16Array,
  [ComponentFieldType.Uint16]: Uint16Array,
  [ComponentFieldType.Int32]: Int32Array,
  [ComponentFieldType.Uint32]: Uint32Array,
  [ComponentFieldType.Float16]: Float16Array,
  [ComponentFieldType.Float32]: Float32Array,
  [ComponentFieldType.Float64]: Float64Array,
  [ComponentFieldType.BigInt64]: BigInt64Array,
  [ComponentFieldType.BigUint64]: BigUint64Array,
}

export class ComponentData<S extends ComponentSchema = ComponentSchema, TShape extends ComponentDataSchema = SchemaToData<S>> implements IComponentData<TShape> {

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

  push(initialValues?: Partial<{ [K in keyof TShape]: number }>) {
    if (this.isFull) {
      this.grow()
    }

    for (const field in this.fields) {
      const value = (initialValues && (initialValues as any)[field] !== undefined)
        ? (initialValues as any)[field]
        : 0

      this.fields[field][this._size] = value
    }

    this._size++
  }

  pop() {
    if (this._size > 0) {
      this._size--
    }
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

  field<Field extends keyof TShape>(field: Field) {
    return this.fields[field]
  }

  private grow() {
    const newCapacity = this.capacity * 3

    for (const field in this.fields) {
      const type = this.schema[field]
      const oldArray = this.fields[field]

      const ArrayConstructor = FieldArrayConstructor[type]

      const newArray = new ArrayConstructor(newCapacity)
      newArray.set(oldArray as any)

      this.fields[field] = newArray as any
    }

    this.capacity = newCapacity
  }
}
