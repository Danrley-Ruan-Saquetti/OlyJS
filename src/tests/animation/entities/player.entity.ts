import { ImageSprite } from '../../../components/index.js'
import { GameObject } from '../../../entities/index.js'
import { Keys } from '../../../enums/key.enum.js'
import { Animator, CanvasRenderer, DeltaTime, Input, StateAnimation } from '../../../utils/index.js'
import {
  PLAYER_STATE_WALK_DOWN_FRAMES,
  PLAYER_STATE_WALK_LEFT_FRAMES,
  PLAYER_STATE_WALK_RIGHT_FRAMES,
  PLAYER_STATE_WALK_UP_FRAMES,
  PLAYER_STATE_IDLE_LEFT_FRAMES,
  PLAYER_STATE_IDLE_RIGHT_FRAMES,
  PLAYER_STATE_IDLE_UP_FRAMES,
  PLAYER_STATE_IDLE_DOWN_FRAMES,
} from '../animation/states/player.state.js'

export class Player extends GameObject {

  body: ImageSprite

  private animator: Animator

  private speed = 100
  private speedAnimation = 200
  private speedAnimationBoosted = this.speedAnimation + 50
  private direction = 'down'
  private isBoostSpeed = false

  constructor(
    public spriteImage: HTMLImageElement
  ) {
    super()
  }

  start() {
    super.start()

    this.body = new ImageSprite(
      this,
      this.spriteImage
    )

    this.animator = new Animator()

    this.animator.addAnimationState(new StateAnimation({
      key: 'idle-down',
      frames: PLAYER_STATE_IDLE_DOWN_FRAMES,
      delay: this.speedAnimation,
      sprite: this.body,
      runOnStart: true,
    }))
    this.animator.addAnimationState(new StateAnimation({
      key: 'idle-up',
      frames: PLAYER_STATE_IDLE_UP_FRAMES,
      delay: this.speedAnimation,
      sprite: this.body,
      runOnStart: true,
    }))
    this.animator.addAnimationState(new StateAnimation({
      key: 'idle-left',
      frames: PLAYER_STATE_IDLE_LEFT_FRAMES,
      delay: this.speedAnimation,
      sprite: this.body,
      runOnStart: true,
    }))
    this.animator.addAnimationState(new StateAnimation({
      key: 'idle-right',
      frames: PLAYER_STATE_IDLE_RIGHT_FRAMES,
      delay: this.speedAnimation,
      sprite: this.body,
      runOnStart: true,
    }))
    this.animator.addAnimationState(new StateAnimation({
      key: 'walk-down',
      frames: PLAYER_STATE_WALK_DOWN_FRAMES,
      delay: this.speedAnimation,
      sprite: this.body,
      isRepeat: true,
      runOnStart: true,
    }))
    this.animator.addAnimationState(new StateAnimation({
      key: 'walk-up',
      frames: PLAYER_STATE_WALK_UP_FRAMES,
      delay: this.speedAnimation,
      sprite: this.body,
      isRepeat: true,
      runOnStart: true,
    }))
    this.animator.addAnimationState(new StateAnimation({
      key: 'walk-left',
      frames: PLAYER_STATE_WALK_LEFT_FRAMES,
      delay: this.speedAnimation,
      sprite: this.body,
      isRepeat: true,
      runOnStart: true,
    }))
    this.animator.addAnimationState(new StateAnimation({
      key: 'walk-right',
      frames: PLAYER_STATE_WALK_RIGHT_FRAMES,
      delay: this.speedAnimation,
      sprite: this.body,
      isRepeat: true,
      runOnStart: true,
    }))
    this.animator.addAnimationState(new StateAnimation({
      key: 'walk-down-speed',
      frames: PLAYER_STATE_WALK_DOWN_FRAMES,
      delay: this.speedAnimationBoosted,
      sprite: this.body,
      isRepeat: true,
      runOnStart: true,
    }))
    this.animator.addAnimationState(new StateAnimation({
      key: 'walk-up-speed',
      frames: PLAYER_STATE_WALK_UP_FRAMES,
      delay: this.speedAnimationBoosted,
      sprite: this.body,
      isRepeat: true,
      runOnStart: true,
    }))
    this.animator.addAnimationState(new StateAnimation({
      key: 'walk-left-speed',
      frames: PLAYER_STATE_WALK_LEFT_FRAMES,
      delay: this.speedAnimationBoosted,
      sprite: this.body,
      isRepeat: true,
      runOnStart: true,
    }))
    this.animator.addAnimationState(new StateAnimation({
      key: 'walk-right-speed',
      frames: PLAYER_STATE_WALK_RIGHT_FRAMES,
      delay: this.speedAnimationBoosted,
      sprite: this.body,
      isRepeat: true,
      runOnStart: true,
    }))

    this.addComponent(this.body)
  }

  update(deltaTime: DeltaTime) {
    let directionMoved: string | null = null

    let boostSpeed = 0

    if (Input.keyboard.isKeyDown(Keys.ShiftLeft)) {
      if (!this.isBoostSpeed) {
        this.animator.getCurrentState().delay = 100
      }

      this.isBoostSpeed = true
      boostSpeed = 50
    } else {
      if (this.isBoostSpeed) {
        this.animator.getCurrentState().delay = 200
      }

      this.isBoostSpeed = false
    }

    if (Input.keyboard.isKeyDown(Keys.KeyW)) {
      this.transform.translate({
        y: -(this.speed + boostSpeed) * deltaTime.elapsedTimeSeconds
      })

      directionMoved = 'up'
    } else if (Input.keyboard.isKeyDown(Keys.KeyS)) {
      this.transform.translate({
        y: (this.speed + boostSpeed) * deltaTime.elapsedTimeSeconds
      })

      directionMoved = 'down'
    }
    if (Input.keyboard.isKeyDown(Keys.KeyA)) {
      this.transform.translate({
        x: -(this.speed + boostSpeed) * deltaTime.elapsedTimeSeconds
      })

      directionMoved = 'left'
    } else if (Input.keyboard.isKeyDown(Keys.KeyD)) {
      this.transform.translate({
        x: (this.speed + boostSpeed) * deltaTime.elapsedTimeSeconds
      })

      directionMoved = 'right'
    }

    if (directionMoved) {
      this.walk(directionMoved)
    } else {
      this.idle()
    }
  }

  walk(direction: string) {
    let keyAnimation = `walk-${direction}`

    if (this.isBoostSpeed) {
      keyAnimation += '-speed'
    }

    if (this.animator.activeState(keyAnimation, { ignoreIfAlreadyActive: true })) {
      this.isBoostSpeed = false
    }
    this.direction = direction
  }

  idle() {
    this.animator.activeState(`idle-${this.direction}`, { ignoreIfAlreadyActive: true })
  }

  render(canvasRenderer: CanvasRenderer) {
    this.body.renderFrame(canvasRenderer)
  }
}
