export class KeyboardSystem {

  start() {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', () => {

    })
  }

  stop() {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  private onKeyDown() {
    console.log(this)
  }
}