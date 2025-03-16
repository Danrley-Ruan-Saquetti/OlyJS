export type GenericClass = new (...args: any[]) => any

export type Class<T extends GenericClass> = new (...args: ConstructorParameters<T>) => InstanceType<T>
