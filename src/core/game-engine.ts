import { LoopCore } from "../util/index.js"

export abstract class GameEngine extends LoopCore {

  async bootstrap() {
    this.initializeEngine()
    await this.loadAssets()
  }

  run() {
    this.initializeScene()
    this.initializeObjects()
    this.start()
  }

  protected initializeEngine() { }
  protected async loadAssets() { }

  protected initializeScene() { }
  protected initializeObjects() { }

  updateObjects() { }
  update() { }
  updateBefore() { }
  updateAfter() { }
}