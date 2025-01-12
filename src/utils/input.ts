import { KeyboardRepository, MouseRepository } from '../repositories/index.js'

export class Input {

  static readonly keyboard = new KeyboardRepository()
  static readonly mouse = new MouseRepository()
}