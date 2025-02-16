import { DeltaTime, InputState, Keys } from '../../../index.js'
import { RacketPlayer } from './player-racket.entity.js'

export class Player extends RacketPlayer {

  move(deltaTime: DeltaTime) {
    if (InputState.isKeyDown(Keys.KeyW)) {
      this.transform.position.y -= this.speed * deltaTime.elapsedTimeSeconds
    } else if (InputState.isKeyDown(Keys.KeyS)) {
      this.transform.position.y += this.speed * deltaTime.elapsedTimeSeconds
    }
  }
}
