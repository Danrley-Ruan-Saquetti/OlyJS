import { DeltaTime } from '../utils/index.js'

export interface IMonoBehaviour {
  start?(): void
  update(deltaTime: DeltaTime): void
}