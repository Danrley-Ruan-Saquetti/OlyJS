import { CycleExecutor, DeltaTime, Input, KeyboardSystem, Keys, TimeoutManager } from '../../index.js'

const cycleExecutor = new CycleExecutor()

const timeout = new TimeoutManager()

let isActive = false

new KeyboardSystem().start()

let id

cycleExecutor.update = (deltaTime: DeltaTime) => {
  timeout.update(deltaTime)

  if (Input.keyboard.isKeyDown(Keys.Space)) {
    if (!isActive) {
      isActive = true

      id = timeout.setInterval(() => {
        console.log('!')
      }, 1_000)
    }
  } else {
    if (isActive) {
      timeout.clearTimeout(id)
    }
    isActive = false
  }
}

cycleExecutor.start()