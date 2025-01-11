import { CameraGameObject } from '../entities/index.js'
import { IRenderable } from '../interfaces/index.js'
import { GameObjectRepository } from '../repositories/index.js'
import { CanvasRenderer, DeltaTime } from '../utils/index.js'
import { GameSystem } from './system.js'

export class RenderSystem2D extends GameSystem {

  private canvasRenderer: CanvasRenderer

  get canvas() { return this._canvas }

  constructor(
    private _canvas: HTMLCanvasElement,
    private gameObjectRepository: GameObjectRepository,
    private cameraGameObject: CameraGameObject
  ) {
    super()
    this.canvasRenderer = new CanvasRenderer(_canvas.getContext('2d')!, this.cameraGameObject)
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

  clear() {
    this.canvasRenderer.clear()
  }
}