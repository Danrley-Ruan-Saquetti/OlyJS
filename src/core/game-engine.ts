import { DeltaTime, CycleExecutor } from '../utils/index.js'

export abstract class GameEngine extends CycleExecutor {

  async bootstrap() {
    try {
      this.initializeEngine()
      await this.loadAssets()
    } catch (error) {
      this.onError(error)
    }
  }

  start() {
    try {
      this.initializeScene()
      this.initializeObjects()

      super.start()
    } catch (error) {
      this.onError(error)
    }
  }

  stop() {
    this.stopObjects()

    super.stop()
  }

  protected nextFrame() {
    try {
      this.deltaTime.next()
      this.updateObjects()
      this.update(this.deltaTime)
      this.updateAfter()
      this.endFrame()
    } catch (error) {
      this.onError(error)
    }
  }

  onError(error: unknown) {
    console.error(error)
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