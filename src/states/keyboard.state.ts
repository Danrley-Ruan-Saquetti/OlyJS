import { Keys } from '../enums/index.js'

export type KeyPressed = { [x in Keys]?: boolean }

export class KeyboardState {

  private keysPressed: KeyPressed = {}

  press(key: Keys) {
    this.keysPressed[key] = true
  }

  release(key: Keys) {
    delete this.keysPressed[key]
  }

  isKeyDown(...keys: Keys[]) {
    return !keys.find(key => !this.keysPressed?.[key])
  }
}