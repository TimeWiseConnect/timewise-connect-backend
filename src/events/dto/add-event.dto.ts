import { CreateChildren } from 'src/childrens/dto/create-children.dto'

export class AddEventDto {
    readonly phone: string
    readonly request: string
    readonly name: string
    readonly children?: CreateChildren
}
