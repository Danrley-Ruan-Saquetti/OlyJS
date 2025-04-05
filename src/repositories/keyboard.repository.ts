import { Keys } from '../enums/index.js'

export class KeyboardRepository {

  private keysPressed = new Map<Keys, boolean>()

  press(key: Keys) {
    this.keysPressed.set(key, true)
  }

  release(key: Keys) {
    this.keysPressed.delete(key)
  }

  isKeyDown(key: Keys) {
    return !!this.keysPressed.get(key)
  }

  clear() {
    this.keysPressed.clear()
  }
}
