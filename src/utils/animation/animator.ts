import { IFrameState, StateAnimation } from './state-animation.js'

export type AnimationStateOptions = {
  key: string
  frames: IFrameState[]
  delay: number
}

export class Animator {

  private states = new Map<string, StateAnimation>()
  private currentState: StateAnimation

  addAnimationState(state: StateAnimation) {
    this.states.set(state.key, state)

    if (!this.currentState) {
      this.activeState(state.key)
    }
  }

  activeState(key: string) {
    const state = this.states.get(key)

    if (!state) {
      throw new Error(`Animation state "${key}" not defined`)
    }

    if (this.currentState) {
      this.currentState.stop()
    }

    this.currentState = state

    this.currentState.start()
  }

  removeState(key: string) {
    this.states.delete(key)
  }

  clearStates() {
    this.states.clear()
  }
}
