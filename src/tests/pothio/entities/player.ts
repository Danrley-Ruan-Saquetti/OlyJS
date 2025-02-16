import { CanvasRenderer, DeltaTime, InputState, Keys, RectangleGameObject, RectangleSpriteComponent, Timeout } from '../../../index.js'

export class Player extends RectangleGameObject {

  sprite: RectangleSpriteComponent

  readonly NORMAL_SPEED = 200
  readonly DASH_SPEED = this.NORMAL_SPEED * 3

  readonly DASH_COOLDOWN = 1_500
  readonly TIME_DASH = 300

  readonly SHOOT_COOLDOWN = 400

  readonly MAX_AMMO = 6

  readonly RELOAD_COOLDOWN = 2_000

  private speed = 200

  private isDashActive = false

  private isShootCooldown = false

  private _ammo = this.MAX_AMMO

  private _isReloadCooldown = false

  private countDashCooldown = 0

  private _points = 0

  get ammo() { return this._ammo }
  get isReloadCooldown() { return this._isReloadCooldown }
  get points() { return this._points }

  start() {
    super.start()

    this.sprite = this.getComponent(RectangleSpriteComponent)!

    this.sprite.color = '#FFF'
  }

  update(deltaTime: DeltaTime) {
    this.resolveDash()
    this.resolveMove(deltaTime)

    if (this.isDashActive) {
      this.countDashCooldown += deltaTime.elapsedTimeSeconds
    }

    if (InputState.isKeyDown(Keys.KeyR)) {
      this.reload()
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
    if (InputState.isKeyDown(Keys.KeyW)) {
      this.transform.translate({
        y: -this.speed * deltaTime.elapsedTimeSeconds,
      })
    } else if (InputState.isKeyDown(Keys.KeyS)) {
      this.transform.translate({
        y: this.speed * deltaTime.elapsedTimeSeconds,
      })
    }
    if (InputState.isKeyDown(Keys.KeyA)) {
      this.transform.translate({
        x: -this.speed * deltaTime.elapsedTimeSeconds,
      })
    } else if (InputState.isKeyDown(Keys.KeyD)) {
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
    this._ammo--

    Timeout.setTimeout(() => {
      this.isShootCooldown = false
    }, this.SHOOT_COOLDOWN)
  }

  reload() {
    if (this._isReloadCooldown || this._ammo == this.MAX_AMMO) {
      return
    }

    this._isReloadCooldown = true

    Timeout.setTimeout(() => {
      this._isReloadCooldown = false
      this._ammo = this.MAX_AMMO
    }, this.RELOAD_COOLDOWN)
  }

  canShoot() {
    return this._ammo > 0 && !this.isShootCooldown && !this._isReloadCooldown
  }

  killEnemy() {
    this._points += 1
  }

  collectCoin() {
    this._points += 5
  }

  render(canvasRenderer: CanvasRenderer) {
    this.sprite.render(canvasRenderer)

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

    const mousePosition = InputState.positionWindow

    canvasRenderer.drawRectangle({
      x: mousePosition.x - 2,
      y: mousePosition.y + 4,
      width: 4,
      height: 10,
      stroke: 'black',
      strokeWidth: 2,
      color: '#FFF',
      fixed: true,
    })

    canvasRenderer.drawRectangle({
      x: mousePosition.x - 2,
      y: mousePosition.y - 14,
      width: 4,
      height: 10,
      stroke: 'black',
      strokeWidth: 2,
      color: '#FFF',
      fixed: true,
    })

    canvasRenderer.drawRectangle({
      x: mousePosition.x - 2,
      y: mousePosition.y + 4,
      width: 4,
      height: 10,
      stroke: 'black',
      strokeWidth: 2,
      color: '#FFF',
      fixed: true,
    })

    canvasRenderer.drawRectangle({
      x: mousePosition.x - 14,
      y: mousePosition.y - 2,
      width: 10,
      height: 4,
      stroke: 'black',
      strokeWidth: 2,
      color: '#FFF',
      fixed: true,
    })

    canvasRenderer.drawRectangle({
      x: mousePosition.x + 4,
      y: mousePosition.y - 2,
      width: 10,
      height: 4,
      stroke: 'black',
      strokeWidth: 2,
      color: '#FFF',
      fixed: true,
    })
  }
}
