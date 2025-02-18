import { GameComponent } from '../../../index.js'

export class HealthComponent extends GameComponent {

  private _health = this._maxHealth

  get health() { return this._health }
  get maxHealth() { return this._maxHealth }
  get isAlive() { return this._health > 0 }
  get isFullHealth() { return this._health == this._maxHealth }

  constructor(
    private _maxHealth = 100
  ) {
    super()
  }

  increaseHealth(value: number) {
    this._health += value

    if (this._health > this._maxHealth) {
      this._health = this._maxHealth
    }
  }

  decreaseHealth(value: number) {
    this._health -= value

    if (this._health < 0) {
      this._health = 0
    }
  }
}
