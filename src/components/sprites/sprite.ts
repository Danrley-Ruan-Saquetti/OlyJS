import { GameObject } from '../../entities/index.js'
import { IRenderable } from '../../interfaces/index.js'
import { CanvasRenderer } from '../../utils/index.js'
import { GameComponent } from '../component.js'

export class SpriteComponent extends GameComponent implements IRenderable {

  color?: string
  fixed?: boolean

  constructor(
    protected gameObject: GameObject
  ) {
    super()
  }

  render(canvasRenderer: CanvasRenderer) { }
}