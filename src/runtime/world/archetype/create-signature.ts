import { Signature } from '../../../ecs/archetype'
import { ComponentIdentifier } from '../../../ecs/component'

export function createSignature(components: ComponentIdentifier[]) {
  let signature: Signature = 0n

  let i = 0, length = components.length
  while (i < length) {
    signature |= 1n << components[i].id

    i++
  }

  return signature
}
