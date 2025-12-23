import { ComponentType } from '../../ecs/component'
import { EntityId } from '../../ecs/entity'
import { IWorld } from '../../ecs/world'
import { ComponentStorage } from '../../game'

type DefaultWorldCommands =
  | { type: 'entity:create', entity: EntityId }
  | { type: 'entity:destroy', entity: EntityId }
  | { type: 'component:add', entity: EntityId, component: ComponentType, value: any }
  | { type: 'component:delete', entity: EntityId, component: ComponentType }

export class DefaultWorld implements IWorld {

  private readonly storages = new Map<ComponentType<any>, ComponentStorage<any>>()
  private readonly commandQueue: DefaultWorldCommands[] = []

  private nextEntityId = 1

  private readonly commandMapHandler: {
    [k in DefaultWorldCommands['type']]: (data: DefaultWorldCommands) => void
  } = {
      'entity:create': this.commandEntityCreate.bind(this),
      'entity:destroy': this.commandEntityDestroy.bind(this),
      'component:add': this.commandComponentAdd.bind(this),
      'component:delete': this.commandComponentDelete.bind(this),
    }

  createEntity() {
    const id = this.nextEntityId++

    this.commandQueue.push({
      type: 'entity:create',
      entity: id
    })

    return id
  }

  flush() {
    for (const command of this.commandQueue) {
      const commandHandler = this.commandMapHandler[command.type]

      if (commandHandler) {
        commandHandler(command)
      }
    }
  }

  private commandEntityCreate(data: DefaultWorldCommands) {

  }

  private commandEntityDestroy(data: DefaultWorldCommands) {

  }

  private commandComponentAdd(data: DefaultWorldCommands) {

  }

  private commandComponentDelete(data: DefaultWorldCommands) {

  }
}
