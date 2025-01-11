import { IRectangle } from '../../interfaces/index.js'
import { ShapeComponent } from './shape.js'

export class RectangleShapeComponent extends ShapeComponent implements IRectangle {

  get width() { return this._width }
  get height() { return this._height }

  set width(value) { this._width = value }
  set height(value) { this._height = value }

  constructor(
    private _width = 0,
    private _height = 0
  ) {
    super()
  }
}