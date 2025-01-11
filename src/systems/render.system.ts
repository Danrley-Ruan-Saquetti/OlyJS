import { ContextRender2D, IRenderable } from '../interfaces/index.js'
import { GameObjectRepository } from '../repositories/index.js'
import { DeltaTime } from '../utils/delta-time.js'
import { GameSystem } from './system.js'

export class RenderSystem2D extends GameSystem {

  private ctx: ContextRender2D

  get canvas() { return this._canvas }

  constructor(
    private _canvas: HTMLCanvasElement,
    private gameObjectRepository: GameObjectRepository
  ) {
    super()
    this.ctx = _canvas.getContext('2d')!
  }

  updateAfter(deltaTime: DeltaTime): void {
    this.clear()
    this.render(this.gameObjectRepository.getGameObjects())
  }

  render(renderable: IRenderable[]) {
    const length = renderable.length

    let i = 0
    while (i < length) {
      renderable[i].render(this.ctx)
      i++
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }
}