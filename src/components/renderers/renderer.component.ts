import { CanvasRenderer } from '../../utils/index.js'
import { GameComponent } from '../game-component.js'

export class RendererComponent extends GameComponent {

  fixed = false
  color = '#FFF'

  draw(canvasRenderer: CanvasRenderer) { }
}
