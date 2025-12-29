import { IBaseList } from './base-list'

export type CompareToHandler<T = any> = (ref1: T, ref2: T) => number

export interface IPriorityQueue<T = any> extends IBaseList {
  insert(value: T): void
  removeMin(): T
  min(): T
}
