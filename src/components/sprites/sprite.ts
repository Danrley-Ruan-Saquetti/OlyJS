import { GameObject } from '../../entities/index.js'
import { IRenderable } from '../../interfaces/index.js'
import { CanvasRenderer } from '../../utils/index.js'

export class SpriteComponent implements IRenderable {

  constructor(
    protected gameObject: GameObject
  ) { }

  render(canvasRenderer: CanvasRenderer) { }
}