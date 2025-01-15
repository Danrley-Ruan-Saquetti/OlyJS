import { IGameSystem } from '../interfaces/index.js'
import { DeltaTime } from '../utils/index.js'

export class GameSystemRepository {
  private _gameSystems: IGameSystem[] = []

  get size() { return this._gameSystems.length }

  start() {
    const length = this._gameSystems.length

    let i = 0
    while (i < length) {
      this._gameSystems[i].start?.()
      i++
    }
  }

  stop() {
    const length = this._gameSystems.length

    let i = 0
    while (i < length) {
      this._gameSystems[i].stop?.()
      i++
    }
  }

  update(deltaTime: DeltaTime) {
    const length = this._gameSystems.length

    let i = 0
    while (i < length) {
      this._gameSystems[i].update(deltaTime)
      i++
    }
  }

  updateAfter(deltaTime: DeltaTime) {
    const length = this._gameSystems.length

    let i = 0
    while (i < length) {
      this._gameSystems[i].updateAfter?.(deltaTime)
      i++
    }
  }

  addGameSystem(...gameSystems: IGameSystem[]) {
    this._gameSystems.push(...gameSystems)
  }

  clear() {
    this._gameSystems = []
  }

  getGameSystems() {
    return this._gameSystems
  }
}