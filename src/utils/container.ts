export class Container<T = any> {

  private items: T[] = []

  add(item: T) {
    this.items.push(item)
  }

  remove(item: T) {
    const index = this.items.indexOf(item)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  get(index: number) {
    return this.items[index]
  }

  contains(item: T) {
    // @ts-expect-error
    return this.items.includes(item)
  }

  getItens() {
    return this.items
  }
}
