import { DeltaTime } from '../utils/index.js'

export interface IMonoBehaviour {
  start(): void
  stop(): void
  update(deltaTime: DeltaTime): void
}