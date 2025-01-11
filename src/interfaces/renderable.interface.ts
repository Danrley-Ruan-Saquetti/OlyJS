import { CanvasRenderer } from '../utils/index.js'

export interface IRenderable {
  render(canvasRenderer: CanvasRenderer): void
}