import { DeltaTime } from '../utils/index.js'

export interface ISystem {
  update(deltaTime: DeltaTime): void
}