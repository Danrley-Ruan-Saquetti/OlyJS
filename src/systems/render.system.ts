import { CameraGameObject } from '../entities/index.js'
import { ContextRender2D, IRenderable } from '../interfaces/index.js'
import { GameObjectRepository } from '../repositories/index.js'
import { CanvasRenderer, DeltaTime } from '../utils/index.js'
import { GameSystem } from './system.js'

export class RenderSystem2D extends GameSystem {

  private canvasRenderer: CanvasRenderer
  private _ctx: ContextRender2D

  get canvas() { return this._canvas }

  constructor(
    private _canvas: HTMLCanvasElement,
    private gameObjectRepository: GameObjectRepository,
    private cameraGameObject?: CameraGameObject
  ) {
    super()

    const ctx = _canvas.getContext('2d')!

    if (ctx == null) throw 'Canvas element cannot have a context to drawing graphics 2D'

    this._ctx = ctx
    this.canvasRenderer = new CanvasRenderer(ctx)

    if (this.cameraGameObject) {
      this.setCameraGameObject(this.cameraGameObject)
    }
  }

  updateAfter(deltaTime: DeltaTime): void {
    this.clear()
    this.render(this.gameObjectRepository.getGameObjects())
  }

  render(renderable: IRenderable[]) {
    const length = renderable.length

    let i = 0
    while (i < length) {
      renderable[i].render(this.canvasRenderer)
      i++
    }
  }

  setCameraGameObject(cameraGameObject: CameraGameObject) {
    this.cameraGameObject = cameraGameObject
    this.canvasRenderer = new CanvasRenderer(this._ctx, cameraGameObject)
  }

  clear() {
    this.canvasRenderer.clear()
  }
}