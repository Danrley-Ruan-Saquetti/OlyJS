export class Random {

  static uuidTime() {
    const timestamp = Date.now()
    const randomNumber = Math.floor(Math.random() * 1000)

    return `${timestamp}-${randomNumber}`
  }

  static next(min: number, max: number) {
    return Math.random() * (max - min) + min
  }
}
