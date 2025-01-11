import { ContextRender2D } from './context-render-2d.interface.js'

export interface IRenderable {
  render(ctx: ContextRender2D): void
}