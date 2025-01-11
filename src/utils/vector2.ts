import { IVector2 } from '../interfaces/index.js'

export class Vector2 implements IVector2 {

  constructor(
    public x = 0, public y = 0
  ) { }
}