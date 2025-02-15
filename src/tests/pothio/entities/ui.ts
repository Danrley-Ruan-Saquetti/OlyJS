import { CanvasRenderer, DeltaTime, GameObject } from '../../../index.js'
import { Player } from './player.js'

export class UIGame extends GameObject {

  private ammunition = 0

  constructor(
    private player: Player,
    private window: HTMLCanvasElement,
  ) {
    super()
  }

  update(deltaTime: DeltaTime) {
    this.ammunition = this.player.ammunition
  }

  render(canvasRenderer: CanvasRenderer) {
    const widthAmmunition = 200
    const heightAmmunition = 100

    canvasRenderer.drawRectangle({
      x: this.window.width - widthAmmunition - 10,
      y: this.window.height - heightAmmunition - 10,
      width: widthAmmunition,
      height: heightAmmunition,
      color: 'transparent',
      stroke: 'grey',
      fixed: true,
    })

    canvasRenderer.drawText({
      x: this.window.width - widthAmmunition + 20,
      y: this.window.height - 30,
      text: `${!this.player.isReloadCooldown ? this.ammunition : '-'}/${this.player.MAX_AMMUNITION}`,
      color: 'gray',
      font: '80px Roboto Mono',
      fixed: true,
    })
  }
}
