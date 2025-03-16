export class Container<T = any> {

  private itens: T[] = []

  add(item: T) {
    this.itens.push(item)
  }

  remove(item: T) {
    const index = this.itens.indexOf(item)

    if (index >= 0) {
      this.itens.splice(index, 1)
    }
  }

  get(index: number) {
    return this.itens[index]
  }

  contains(item: T) {
    // @ts-expect-error
    return this.itens.includes(item)
  }

  getItens() {
    return this.itens
  }
}
