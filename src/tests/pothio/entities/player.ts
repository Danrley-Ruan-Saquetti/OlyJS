import { CanvasRenderer, DeltaTime, InputState, Keys, RectangleGameObject, RectangleSpriteComponent, Timeout } from '../../../index.js'
import { HealthComponent } from '../components/health.js'

export class Player extends RectangleGameObject {

  sprite: RectangleSpriteComponent
  health: HealthComponent

  readonly NORMAL_SPEED = 200
  readonly DASH_SPEED = this.NORMAL_SPEED * 3

  readonly DASH_COOLDOWN = 1_500
  readonly TIME_DASH = 300

  readonly SHOOT_COOLDOWN = 400

  private speed = this.NORMAL_SPEED

  private isDashActive = false

  private isShootCooldown = false

  private countDashCooldown = 0

  private _points = 0

  get points() { return this._points }

  start() {
    super.start()

    this.health = new HealthComponent(5)
    this.sprite = this.getComponent(RectangleSpriteComponent)!

    this.sprite.color = '#FFF'

    this.addComponent(this.health)
  }

  update(deltaTime: DeltaTime) {
    this.resolveDash()
    this.resolveMove(deltaTime)

    if (this.isDashActive) {
      this.countDashCooldown += deltaTime.elapsedTimeSeconds
    }
  }

  resolveDash() {
    if (InputState.isKeyDown(Keys.ShiftLeft)) {
      if (!this.isDashActive) {
        this.isDashActive = true

        this.speed = this.DASH_SPEED

        Timeout.setTimeout(() => {
          this.speed = this.NORMAL_SPEED

          Timeout.setTimeout(() => {
            this.isDashActive = false
            this.countDashCooldown = 0
          }, this.DASH_COOLDOWN)
        }, this.TIME_DASH)
      }
    }
  }

  resolveMove(deltaTime: DeltaTime) {
    const move = {
      x: 0,
      y: 0,
    }

    if (InputState.isKeyDown(Keys.KeyW)) {
      move.y = -this.speed * deltaTime.elapsedTimeSeconds
    } else if (InputState.isKeyDown(Keys.KeyS)) {
      move.y = this.speed * deltaTime.elapsedTimeSeconds
    }
    if (InputState.isKeyDown(Keys.KeyA)) {
      move.x = -this.speed * deltaTime.elapsedTimeSeconds
    } else if (InputState.isKeyDown(Keys.KeyD)) {
      move.x = this.speed * deltaTime.elapsedTimeSeconds
    }

    this.transform.moveNormalized(move)
  }

  shoot() {
    if (!this.canShoot()) {
      return
    }

    if (this.isShootCooldown) {
      return
    }

    this.isShootCooldown = true

    Timeout.setTimeout(() => {
      this.isShootCooldown = false
    }, this.SHOOT_COOLDOWN)
  }

  canShoot() {
    return !this.isShootCooldown
  }

  takeDamageEnemy() {
    this.health.decreaseHealth(1)
  }

  killEnemy() {
    this._points += 1
  }

  collectCoin() {
    this._points += 5
  }

  render(canvasRenderer: CanvasRenderer) {
    this.sprite.render(canvasRenderer)

    if (!this.health.isFullHealth) {
      const widthHealth = (this.health.health * this.rectangleSpriteComponent.shape.width) / this.health.maxHealth

      canvasRenderer.drawRectangle({
        x: this.transform.position.x - (this.rectangleSpriteComponent.shape.width / 2),
        y: this.transform.position.y - (this.rectangleSpriteComponent.shape.height / 2) - 18,
        width: widthHealth,
        height: 8,
        color: '#FF0000'
      })
    }

    if (this.isDashActive) {
      const widthCooldownCount = (this.countDashCooldown * this.rectangleSpriteComponent.shape.width) / (this.DASH_COOLDOWN + this.TIME_DASH)

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
