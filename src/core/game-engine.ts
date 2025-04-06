import { LoopCore } from '../utils/index.js'

export abstract class GameEngine extends LoopCore {

  async bootstrap() {
    this.initializeEngine()
    await this.loadAssets()
  }

  run() {
    this.initializeScene()
    this.initializeObjects()
    this.startObjects()
    this.start()
  }

  override stop() {
    super.stop()
    this.stopObjects()
  }

  protected initializeEngine() { }
  protected async loadAssets() { }

  protected initializeScene() { }
  protected initializeObjects() { }

  protected startObjects() { }
  protected stopObjects() { }

  updateObjects() { }
  update() { }
  updateBefore() { }
  updateAfter() { }
}
