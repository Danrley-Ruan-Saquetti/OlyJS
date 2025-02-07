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
    canvasRenderer.drawImage(this.getDefaultRenderOptions())
  }

  renderFrame(canvasRenderer: CanvasRenderer) {
    canvasRenderer.drawImageFrame({
      ...this.getDefaultRenderOptions(),
      imageX: this.origin.x,
      imageY: this.origin.y,
      imageWidth: this.dimension.width,
      imageHeight: this.dimension.height,
    })
  }

  private getDefaultRenderOptions() {
    const dimension = {
      width: this.dimension.width * this.scale.width,
      height: this.dimension.height * this.scale.height,
    }

    return {
      image: this.image,
      x: this.gameObject.transform.position.x + this.offset.x - (dimension.width / 2),
      y: this.gameObject.transform.position.y + this.offset.y - (dimension.height / 2),
      fixed: this.fixed,
      ...dimension,
    }
  }
}
