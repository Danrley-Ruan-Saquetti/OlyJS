import { Input, Keys } from '../../contracts/input'

export type InputStateConfig = {
  mouseSensitivity: number
}

export class InputState implements Input {

  private readonly keys = {
    held: new Set<Keys>(),
    down: new Set<Keys>(),
    up: new Set<Keys>()
  }

  private readonly mouseDelta = {
    x: 0,
    y: 0
  }

  private readonly mousePosition = {
    x: 0,
    y: 0
  }

  private readonly buttons = {
    held: new Set<number>(),
    down: new Set<number>(),
    up: new Set<number>()
  }

  private readonly keysToAdd = new Set<Keys>()
  private readonly keysToRemove = new Set<Keys>()

  private readonly buttonsToAdd = new Set<number>()
  private readonly buttonsToRemove = new Set<number>()

  private readonly bufferMouseDelta = { x: 0, y: 0 }
  private readonly bufferMousePosition = { x: 0, y: 0 }

  private config: InputStateConfig = {
    mouseSensitivity: 1
  }

  constructor(config: Partial<InputStateConfig> = {}) {
    if (config.mouseSensitivity !== undefined) {
      this.config.mouseSensitivity = config.mouseSensitivity
    }
  }

  update() {
    this.keys.down.clear()
    this.keys.up.clear()
    this.buttons.down.clear()
    this.buttons.up.clear()

    for (const value of this.keysToRemove) {
      this.keys.held.delete(value)
      this.keys.up.add(value)
    }

    this.keysToRemove.clear()

    for (const value of this.keysToAdd) {
      this.keys.held.add(value)
      this.keys.down.add(value)
    }

    this.keysToAdd.clear()

    for (const value of this.buttonsToRemove) {
      this.buttons.held.delete(value)
      this.buttons.up.add(value)
    }

    this.buttonsToRemove.clear()

    for (const value of this.buttonsToAdd) {
      this.buttons.held.add(value)
      this.buttons.down.add(value)
    }

    this.buttonsToAdd.clear()

    this.mousePosition.x = this.bufferMousePosition.x
    this.mousePosition.y = this.bufferMousePosition.y

    this.mouseDelta.x = this.bufferMouseDelta.x * this.config.mouseSensitivity
    this.mouseDelta.y = this.bufferMouseDelta.y * this.config.mouseSensitivity

    this.bufferMouseDelta.x = 0
    this.bufferMouseDelta.y = 0
  }

  reset() {
    this.keys.down.clear()
    this.keys.held.clear()
    this.keys.up.clear()
    this.buttons.down.clear()
    this.buttons.held.clear()
    this.buttons.up.clear()
    this.keysToAdd.clear()
    this.keysToRemove.clear()
    this.buttonsToAdd.clear()
    this.buttonsToRemove.clear()
    this.bufferMouseDelta.x = 0
    this.bufferMouseDelta.y = 0
  }

  keyDown(key: Keys) {
    if (this.keys.held.has(key)) {
      return
    }

    this.keysToAdd.add(key)
    this.keysToRemove.delete(key)
  }

  keyUp(key: Keys) {
    this.keysToRemove.add(key)
    this.keysToAdd.delete(key)
  }

  mouseDown(button: number) {
    if (this.buttons.held.has(button)) {
      return
    }

    this.buttonsToAdd.add(button)
    this.buttonsToRemove.delete(button)
  }

  mouseUp(button: number) {
    this.buttonsToRemove.add(button)
    this.buttonsToAdd.delete(button)
  }

  mouseMove(deltaX: number, deltaY: number) {
    if (document.pointerLockElement === null) {
      return
    }

    this.bufferMouseDelta.x += deltaX
    this.bufferMouseDelta.y += deltaY
  }

  setMousePosition(x: number, y: number) {
    this.bufferMousePosition.x = x
    this.bufferMousePosition.y = y
  }

  isKeyHeld(key: Keys) {
    return this.keys.held.has(key)
  }

  isKeyDown(key: Keys) {
    return this.keys.down.has(key)
  }

  isKeyUp(key: Keys) {
    return this.keys.up.has(key)
  }

  isMouseButtonHeld(button: number) {
    return this.buttons.held.has(button)
  }

  isMouseButtonDown(button: number) {
    return this.buttons.down.has(button)
  }

  isMouseButtonUp(button: number) {
    return this.buttons.up.has(button)
  }

  getMouseDeltaX() {
    return this.mouseDelta.x
  }

  getMouseDeltaY() {
    return this.mouseDelta.y
  }

  getMousePositionX() {
    return this.mousePosition.x
  }

  getMousePositionY() {
    return this.mousePosition.y
  }

  getMouseDelta() {
    return this.mouseDelta
  }

  getMousePosition() {
    return this.mousePosition
  }
}
