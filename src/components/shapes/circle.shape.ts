import { ShapeComponent } from './shape'

export class CircleShape extends ShapeComponent {

  get radius() { return this._radius }

  set radius(value) { this._radius = value }

  constructor(
    public _radius: number
  ) {
    super()
  }
}