import { IInputSource, Input, Keys } from '../../contracts/engine/input'
import { InputState } from '../../engine/input/input-state'
import { System } from '../../systems/system'

export class InputSystem extends System implements IInputSource {

  private readonly _state = new InputState({ mouseSensitivity: .002 })

  get state(): Input {
    return this._state
  }

  start() {
    this._state.reset()

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('blur', this.onBlur)
  }

  stop() {
    this._state.reset()

    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('blur', this.onBlur)
  }

  update() {
    this._state.update()
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) {
      return
    }

    this._state.keyDown(e.code as Keys)
  }

  private onKeyUp = (e: KeyboardEvent) => {
    this._state.keyUp(e.code as Keys)
  }

  private onMouseDown = (e: MouseEvent) => {
    this._state.mouseDown(e.button)
  }

  private onMouseUp = (e: MouseEvent) => {
    this._state.mouseUp(e.button)
  }

  private onMouseMove = (e: MouseEvent) => {
    this._state.setMousePosition(e.clientX, e.clientY)

    if (document.pointerLockElement === null) {
      return
    }

    this._state.mouseMove(e.movementX, e.movementY)
  }

  private onBlur = () => {
    this._state.reset()
  }
}
