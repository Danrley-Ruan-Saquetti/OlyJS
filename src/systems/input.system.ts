import { IInputSource, InputState, Keys } from '../runtime/contracts/input'
import { EngineSystem } from './system'

export class InputSystem extends EngineSystem implements IInputSource {

  private readonly _state = {
    keys: {
      held: new Set<Keys>(),
      down: new Set<Keys>(),
      up: new Set<Keys>()
    },
    mouse: {
      x: 0,
      y: 0,
      buttons: {
        held: new Set<number>(),
        down: new Set<number>(),
        up: new Set<number>()
      }
    },
    toString() {
      return `{keys: [${(this.keys.held.values() as any).toArray()}], position: {x: ${this.mouse.x}, y: ${this.mouse.y}}, mouse: [${(this.mouse.buttons.held.values() as any).toArray()}]}`
    }
  }

  private keysToAdd = new Set<Keys>()
  private keysToRemove = new Set<Keys>()

  private buttonsToAdd = new Set<number>()
  private buttonsToRemove = new Set<number>()

  private offsetMouse = { x: 0, y: 0 }

  private mouseSensitivity = .002

  get state(): InputState {
    return this._state
  }

  start() {
    this.reset()

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('blur', this.onBlur)
  }

  stop() {
    this.reset()

    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('blur', this.onBlur)
  }

  private reset() {
    this._state.keys.down.clear()
    this._state.keys.held.clear()
    this._state.keys.up.clear()
    this._state.mouse.buttons.down.clear()
    this._state.mouse.buttons.held.clear()
    this._state.mouse.buttons.up.clear()
    this.keysToAdd.clear()
    this.keysToRemove.clear()
    this.buttonsToAdd.clear()
    this.buttonsToRemove.clear()
    this.offsetMouse.x = 0
    this.offsetMouse.y = 0
  }

  update() {
    this._state.keys.down.clear()
    this._state.keys.up.clear()
    this._state.mouse.buttons.down.clear()
    this._state.mouse.buttons.up.clear()

    for (const value of this.keysToRemove) {
      this._state.keys.held.delete(value)
      this._state.keys.up.add(value)
    }

    this.keysToRemove.clear()

    for (const value of this.keysToAdd) {
      this._state.keys.held.add(value)
      this._state.keys.down.add(value)
    }

    this.keysToAdd.clear()

    for (const value of this.buttonsToRemove) {
      this._state.mouse.buttons.held.delete(value)
      this._state.mouse.buttons.up.add(value)
    }

    this.buttonsToRemove.clear()

    for (const value of this.buttonsToAdd) {
      this._state.mouse.buttons.held.add(value)
      this._state.mouse.buttons.down.add(value)
    }

    this.buttonsToAdd.clear()

    this._state.mouse.x = this.offsetMouse.x * this.mouseSensitivity
    this._state.mouse.y = this.offsetMouse.y * this.mouseSensitivity

    this.offsetMouse.x = 0
    this.offsetMouse.y = 0
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || this._state.keys.held.has(e.key as Keys)) {
      return
    }

    this.keysToAdd.add(e.key as Keys)
    this.keysToRemove.delete(e.key as Keys)
  }

  private onKeyUp = (e: KeyboardEvent) => {
    this.keysToRemove.add(e.key as Keys)
    this.keysToAdd.delete(e.key as Keys)
  }

  private onMouseDown = (e: MouseEvent) => {
    if (this._state.mouse.buttons.held.has(e.button)) {
      return
    }

    this.buttonsToAdd.add(e.button)
    this.buttonsToRemove.delete(e.button)
  }

  private onMouseUp = (e: MouseEvent) => {
    this.buttonsToRemove.add(e.button)
    this.buttonsToAdd.delete(e.button)
  }

  private onMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement === null) {
      return
    }

    this.offsetMouse.x += e.movementX
    this.offsetMouse.y += e.movementY
  }

  private onBlur = () => {
    this.reset()
  }
}
