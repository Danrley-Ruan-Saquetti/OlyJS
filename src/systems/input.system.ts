import { IInputSource, InputState, Keys } from '../runtime/contracts/input'
import { EngineSystem } from './system'

export class InputSystem extends EngineSystem implements IInputSource {

  private readonly _state = {
    keys: new Set<Keys>(),
    mouse: {
      x: 0,
      y: 0,
      buttons: new Set<number>()
    }
  }

  private keysToAdd = new Set<Keys>()
  private keysToRemove = new Set<Keys>()

  private buttonsToAdd = new Set<number>()
  private buttonsToRemove = new Set<number>()

  private positionToUpdate = { x: 0, y: 0 }

  get state(): InputState {
    return this._state
  }

  start() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  stop() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }

  update() {
    for (const value of this.keysToRemove) {
      this._state.keys.delete(value)
    }

    this.keysToRemove.clear()

    for (const value of this.keysToAdd) {
      this._state.keys.add(value)
    }

    this.keysToAdd.clear()
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (this._state.keys.has(e.key as Keys)) {
      return
    }

    this.keysToAdd.add(e.key as Keys)
    this.keysToRemove.delete(e.key as Keys)
  }

  private onKeyUp = (e: KeyboardEvent) => {
    this.keysToRemove.add(e.key as Keys)
    this.keysToAdd.delete(e.key as Keys)
  }
}
