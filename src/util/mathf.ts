export class Mathf {

  static lerp(a: number, b: number, delta: number) {
    return a + (b - a) * Mathf.clamp01(delta)
  }

  static lerpClamped01(a: number, b: number, delta: number) {
    return a + (b - a) * Mathf.clamp01(delta)
  }

  static moveTowards(current: number, target: number, maxDelta: number) {
    const delta = target - current

    if (Math.abs(delta) <= maxDelta) {
      return target
    }

    return current + Math.sign(delta) * maxDelta
  }

  static smoothStep(a: number, b: number, delta: number) {
    delta = Mathf.clamp01(delta)

    return a + (b - a) * (delta ** 2 * (3 - 2 * delta))
  }

  static clamp01(value: number) {
    return Mathf.clamp(value, 0, 1)
  }

  static clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value))
  }

  static pingPong(t: number, length: number) {
    t = Mathf.repeat(t, length * 2)

    return length - Math.abs(t - length)
  }

  static deltaAngle(current: number, target: number) {
    let delta = Mathf.repeat(target - current, 360)

    if (delta > 180) {
      delta -= 360
    }

    return delta
  }

  static repeat(t: number, length: number) {
    return t - Math.floor(t / length) * length
  }

  static approximately(a: number, b: number) {
    return Math.abs(a - b) < 1e-6
  }

  static inverseLerp(a: number, b: number, value: number) {
    return a !== b ? Mathf.clamp01((value - a) / (b - a)) : 0
  }

  static perlinNoise(x: number, y: number) {
    function fade(t: number) {
      return t * t * t * (t * (t * 6 - 15) + 10)
    }

    function grad(hash: number, x: number, y: number) {
      const h = hash & 3

      const u = h < 2 ? x : y
      const v = h < 2 ? y : x

      return (h & 1 ? -u : u) + (h & 2 ? -2 * v : 2 * v)
    }

    function noise(x: number, y: number) {
      const X = Math.floor(x) & 255
      const Y = Math.floor(y) & 255

      x -= Math.floor(x)
      y -= Math.floor(y)

      const u = fade(x)
      const v = fade(y)

      const a = (X + Y) & 255
      const b = (X + Y + 1) & 255

      return (1 - v) * ((1 - u) * grad(a, x, y) + u * grad(a + 1, x - 1, y)) + v * ((1 - u) * grad(b, x, y - 1) + u * grad(b + 1, x - 1, y - 1))
    }

    return (noise(x, y) + 1) / 2
  }
}
