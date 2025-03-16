import { Transform } from '../components/index.js'
import { CanvasRenderer } from '../utils/index.js'
import { GameSystem } from './game-system.js'

export class RenderSystem extends GameSystem {

  public canvasRenderer: CanvasRenderer

  constructor(private canvas: HTMLCanvasElement, cameraTransform?: Transform) {
    super()

    const ctx = canvas.getContext('2d')!

    if (ctx == null) throw new Error('Your browser does not support CanvasContext2D')

    this.canvasRenderer = new CanvasRenderer(ctx, cameraTransform)
  }

  updateBefore() {
    this.canvasRenderer.clear()
  }

  updateAfter() {

  }
}
