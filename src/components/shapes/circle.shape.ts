import { ICircle } from '../../interfaces/index.js'
import { ShapeComponent } from './shape.js'

export class CircleShapeComponent extends ShapeComponent implements ICircle {

  get radius() { return this._radius }

  set radius(value) { this._radius = value }

  constructor(
    public _radius = 1
  ) {
    super()
  }
}