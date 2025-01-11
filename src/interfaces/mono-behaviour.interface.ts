import { DeltaTime } from '../utils/delta-time'

export interface IMonoBehaviour {
  wakeUp?(): void
  start?(): void
  update(deltaTime: DeltaTime): void
}