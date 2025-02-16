import { CanvasRenderer, DeltaTime, GameObject } from '../../../index.js'
import { Player } from './player.js'

export class UIGame extends GameObject {

  private ammo = 0

  constructor(
    private player: Player,
    private window: HTMLCanvasElement,
  ) {
    super()
  }

  update(deltaTime: DeltaTime) {
    this.ammo = this.player.ammo
  }

  render(canvasRenderer: CanvasRenderer) {
    const widthAmmo = 200
    const heightAmmo = 100

    canvasRenderer.drawRectangle({
      x: this.window.width - widthAmmo - 10,
      y: this.window.height - heightAmmo - 10,
      width: widthAmmo,
      height: heightAmmo,
      color: 'transparent',
      stroke: 'grey',
      fixed: true,
    })

    canvasRenderer.drawText({
      x: this.window.width - widthAmmo + 20,
      y: this.window.height - 30,
      text: `${!this.player.isReloadCooldown ? this.ammo : '-'}/${this.player.MAX_AMMO}`,
      color: 'gray',
      font: '80px Roboto Mono',
      fixed: true,
    })
  }
}
