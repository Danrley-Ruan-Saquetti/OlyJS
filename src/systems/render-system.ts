import { GameComponent, RendererComponent, Transform } from '../components/index.js'
import { Game } from '../core/index.js'
import { GameObject } from '../entities/index.js'
import { CanvasRenderer, Container } from '../utils/index.js'
import { GameSystem } from './game-system.js'

export class RenderSystem extends GameSystem {

  public canvasRenderer: CanvasRenderer

  private rendererComponentContainer = new Container<RendererComponent>()

  constructor(private _game: Game, private canvas: HTMLCanvasElement, cameraTransform?: Transform) {
    super()

    const ctx = canvas.getContext('2d')!

    if (ctx == null) throw new Error('Your browser does not support CanvasContext2D')

    this.canvasRenderer = new CanvasRenderer(ctx, cameraTransform)

    _game.on('game/game-object/instantiate', (gameObject: GameObject) => {
      gameObject.on('game-object/component/add', (gameComponent: GameComponent) => {
        if (gameComponent instanceof RendererComponent) {
          this.addRendererComponent(gameComponent)
        }
      })
      gameObject.on('game-object/component/remove', (gameComponent: GameComponent) => {
        if (gameComponent instanceof RendererComponent) {
          this.removeRendererComponent(gameComponent)
        }
      })
    })
  }

  updateBefore() {
    this.canvasRenderer.clear()
  }

  updateAfter() {
    const renderComponents = this.rendererComponentContainer.getItens()

    const len = renderComponents.length
    let i = 0

    while (i < len) {
      renderComponents[i].draw(this.canvasRenderer)
      i++
    }
  }

  addRendererComponent(component: RendererComponent) {
    this.rendererComponentContainer.add(component)
  }

  removeRendererComponent(component: RendererComponent) {
    this.rendererComponentContainer.remove(component)
  }
}
