import { KeyboardRepository, MouseRepository } from '../repositories/index.js'

export class InputManager {

  static readonly keyboard = new KeyboardRepository()
  static readonly mouse = new MouseRepository()
}
