import { Keys } from '../enums/index.js'

export type KeyPressed = { [x in Keys]?: boolean }

export class KeyboardRepository {

  private keysPressed: KeyPressed = {}

  press(key: Keys) {
    this.keysPressed[key] = true
  }

  release(key: Keys) {
    delete this.keysPressed[key]
  }

  isKeyDown(key: Keys) {
    return !!this.keysPressed?.[key]
  }

  clear() {
    this.keysPressed = {}
  }
}