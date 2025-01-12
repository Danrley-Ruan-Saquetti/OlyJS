import { DeltaTime, Input, Keys } from '../../../index.js'
import { RacketPlayer } from './player-racket.entity.js'

export class Player extends RacketPlayer {

  move(deltaTime: DeltaTime) {
    if (Input.keyboard.isKeyDown(Keys.KeyW)) {
      this.transform.position.y -= this.speed * deltaTime.elapsedTimeSeconds
    } else if (Input.keyboard.isKeyDown(Keys.KeyS)) {
      this.transform.position.y += this.speed * deltaTime.elapsedTimeSeconds
    }
  }
}