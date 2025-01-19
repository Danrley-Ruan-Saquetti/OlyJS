import { Tag } from '../interfaces/index.js'

export class ContainerTagRepository {

  private tags = new Map<Tag, Tag>()

  add(tag: Tag) {
    this.tags.set(tag, tag)
  }

  remove(tag: Tag) {
    return this.tags.delete(tag)
  }

  has(...tags: Tag[]) {
    return tags.every(tag => !!this.tags.get(tag))
  }

  getTags() {
    return this.tags.values()
  }
}