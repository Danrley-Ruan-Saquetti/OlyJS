import { DeltaTime } from '../utils/index.js'

export interface IGameSystem {
  start(): void
  stop(): void
  updateBefore(deltaTime: DeltaTime): void
  update(deltaTime: DeltaTime): void
  updateAfter(deltaTime: DeltaTime): void
}
