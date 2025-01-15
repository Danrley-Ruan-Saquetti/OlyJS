import { DeltaTime, CycleExecutor } from '../utils/index.js'

export abstract class GameEngine extends CycleExecutor {

  async bootstrap() {
    this.initializeEngine()
    await this.loadAssets()
  }

  start() {
    this.initializeScene()
    this.initializeObjects()

    super.start()
  }

  stop() {
    this.stopObjects()

    super.stop()
  }

  protected nextFrame() {
    this.deltaTime.next()
    this.updateObjects()
    this.update(this.deltaTime)
    this.updateAfter()
    this.endFrame()
  }

  protected initializeEngine() { }
  protected async loadAssets() { }

  protected initializeScene() { }
  protected initializeObjects() { }

  protected stopObjects() { }

  protected updateObjects() { }
  update(deltaTime: DeltaTime) { }
  protected updateAfter() { }
}