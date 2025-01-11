import { DeltaTime } from '../utils/index.js'

export interface IMonoBehaviour {
  wakeUp?(): void
  start?(): void
  update(deltaTime: DeltaTime): void
}