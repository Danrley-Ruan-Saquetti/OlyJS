import { DeltaTime } from '../util/index.js'

export class GameSystem {

  start() { }
  stop() { }
  updateBefore(deltaTime: DeltaTime) { }
  update(deltaTime: DeltaTime) { }
  updateAfter(deltaTime: DeltaTime) { }
}
