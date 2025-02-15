import { CanvasRenderer, DeltaTime, Input, Keys, RectangleGameObject, RectangleSpriteComponent, Timeout } from '../../../index.js'

export class Player extends RectangleGameObject {

  sprite: RectangleSpriteComponent

  readonly MAX_AMMUNITION = 6

  private normalSpeed = 200
  private dashSpeed = this.normalSpeed * 2
  private speed = 200

  ammunition = this.MAX_AMMUNITION

  private isDashActive = false
  private dashCooldown = 1_500
  private timeInDash = 300

  private shootCooldown = 500
  private isShootCooldown = false

  private reloadCooldown = 2_000
  isReloadCooldown = false

  private countCooldown = 0

  start() {
    super.start()

    this.sprite = this.getComponent(RectangleSpriteComponent)!

    this.sprite.color = '#FFF'
  }

  update(deltaTime: DeltaTime) {
    this.dash()
    this.move(deltaTime)

    if (this.isDashActive) {
      this.countCooldown += deltaTime.elapsedTimeSeconds
    }

    if (Input.keyboard.isKeyDown(Keys.KeyR)) {
      this.reload()
    }
  }

  dash() {
    if (Input.keyboard.isKeyDown(Keys.ShiftLeft)) {
      if (!this.isDashActive) {
        this.speed = this.dashSpeed

        this.isDashActive = true

        Timeout.setTimeout(() => {
          this.speed = this.normalSpeed

          Timeout.setTimeout(() => {
            this.isDashActive = false
            this.countCooldown = 0
          }, this.dashCooldown)
        }, this.timeInDash)
      }
    }
  }

  move(deltaTime: DeltaTime) {
    if (Input.keyboard.isKeyDown(Keys.KeyW)) {
      this.transform.translate({
        y: -this.speed * deltaTime.elapsedTimeSeconds,
      })
    } else if (Input.keyboard.isKeyDown(Keys.KeyS)) {
      this.transform.translate({
        y: this.speed * deltaTime.elapsedTimeSeconds,
      })
    }
    if (Input.keyboard.isKeyDown(Keys.KeyA)) {
      this.transform.translate({
        x: -this.speed * deltaTime.elapsedTimeSeconds,
      })
    } else if (Input.keyboard.isKeyDown(Keys.KeyD)) {
      this.transform.translate({
        x: this.speed * deltaTime.elapsedTimeSeconds,
      })
    }
  }

  shoot() {
    if (!this.canShoot()) {
      return
    }

    if (this.isShootCooldown) {
      return
    }

    this.isShootCooldown = true
    this.ammunition--

    Timeout.setTimeout(() => {
      this.isShootCooldown = false
    }, this.shootCooldown)

    if (this.ammunition <= 0) {
      this.reload()
    }
  }

  reload() {
    if (this.isReloadCooldown || this.ammunition == this.MAX_AMMUNITION) {
      return
    }

    this.isReloadCooldown = true

    Timeout.setTimeout(() => {
      this.isReloadCooldown = false
      this.ammunition = this.MAX_AMMUNITION
    }, this.reloadCooldown)
  }

  canShoot() {
    return !this.isShootCooldown && !this.isReloadCooldown
  }

  render(canvasRenderer: CanvasRenderer) {
    this.sprite.render(canvasRenderer)

    if (this.isDashActive) {
      const widthCooldownCount = (this.countCooldown * this.rectangleSpriteComponent.shape.width) / (this.dashCooldown + this.timeInDash)

      canvasRenderer.drawRectangle({
        x: this.transform.position.x - (this.rectangleSpriteComponent.shape.width / 2),
        y: this.transform.position.y + (this.rectangleSpriteComponent.shape.height / 2) + 10,
        width: widthCooldownCount * 1_000,
        height: 8,
        color: '#fff'
      })
    }
  }
}
