import { GameObject } from '../../entities/index.js'
import { IRenderable } from '../../interfaces/index.js'
import { CanvasRenderer, Vector3 } from '../../utils/index.js'
import { GameComponent } from '../component.js'

export class SpriteComponent extends GameComponent implements IRenderable {

  offset = new Vector3()
  color?: string
  fixed?: boolean

  constructor(
    protected gameObject: GameObject
  ) {
    super()
  }

  render(canvasRenderer: CanvasRenderer) { }
}