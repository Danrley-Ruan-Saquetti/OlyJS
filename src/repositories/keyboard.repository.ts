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

  isKeyDown(...keys: Keys[]) {
    return keys.every(key => this.keysPressed?.[key])
  }

  getKeysPressed() {
    return Object.keys(this.keysPressed) as Keys[]
  }

  clear() {
    this.keysPressed = {}
  }
}