export type ListenerHandle<T = any> = (data: T) => void | any

export class Listener<T = any> {

  constructor(public handler: ListenerHandle<T>) { }
}
