import { ICircle } from '../../interfaces/circle.interface'
import { ShapeComponent } from './shape'

export class CircleShapeComponent extends ShapeComponent implements ICircle {

  get radius() { return this._radius }

  set radius(value) { this._radius = value }

  constructor(
    public _radius: number
  ) {
    super()
  }
}