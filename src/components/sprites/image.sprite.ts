import { GameObject } from '../../entities/index.js'
import { CanvasRenderer } from '../../utils/index.js'
import { SpriteComponent } from './sprite.js'

export class ImageSprite extends SpriteComponent {

  get image() { return this._image }

  constructor(
    gameObject: GameObject,
    private _image: HTMLImageElement
  ) {
    super(gameObject)
  }

  render(canvasRenderer: CanvasRenderer) {
    canvasRenderer.drawImage({
      image: this.image,
      x: this.gameObject.transform.position.x,
      y: this.gameObject.transform.position.y,
      width: this.image.width,
      height: this.image.height,
      fixed: this.fixed,
    })
  }
}