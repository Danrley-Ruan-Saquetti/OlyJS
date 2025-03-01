import { DeltaTime } from '../utils/delta-time'
import { IGameSystem } from './../interfaces/index'

export class GameSystem implements IGameSystem {

  start() { }
  stop() { }
  updateBefore(deltaTime: DeltaTime) { }
  update(deltaTime: DeltaTime) { }
  updateAfter(deltaTime: DeltaTime) { }
}
