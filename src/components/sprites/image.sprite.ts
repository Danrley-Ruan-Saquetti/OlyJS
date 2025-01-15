import { GameObject } from '../../entities/index.js'
import { IRectangle } from '../../interfaces/index.js'
import { CanvasRenderer, Vector2 } from '../../utils/index.js'
import { SpriteComponent } from './sprite.js'

export class ImageSprite extends SpriteComponent {

  origin = new Vector2()
  scale: IRectangle = { width: 1, height: 1 }
  dimension: IRectangle = { width: this._image.width, height: this._image.height }

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
      x: this.gameObject.transform.position.x + this.offset.x,
      y: this.gameObject.transform.position.y + this.offset.y,
      width: this.image.width,
      height: this.image.height,
      fixed: this.fixed,
    })
  }

  renderFrame(canvasRenderer: CanvasRenderer) {
    canvasRenderer.drawImageFrame({
      image: this.image,
      x: this.gameObject.transform.position.x + this.offset.x,
      y: this.gameObject.transform.position.y + this.offset.y,
      imageX: this.origin.x,
      imageY: this.origin.y,
      imageWidth: this.dimension.width,
      imageHeight: this.dimension.height,
      width: this.dimension.width * this.scale.width,
      height: this.dimension.height * this.scale.height,
      fixed: this.fixed,
    })
  }
}