import { Game } from "../core/index.js"
import { IMonoBehaviour } from "../interfaces/index.js"

export class GameObject implements IMonoBehaviour {

  get time() { return this._game.deltaTime }

  constructor(private _game: Game) { }

  awake() { }
  start() { }
  update() { }

  destroy(gameObject: GameObject) {
    this._game.destroy(gameObject)
  }

  instantiate<T extends GameObject>(classGameObject: new (...args: ConstructorParameters<typeof GameObject>) => T) {
    return this._game.instantiate(classGameObject)
  }
}