import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Children } from './children.model'
import { CreateChildren } from './dto/create-children.dto'
import { User } from 'src/users/user.model'

@Injectable()
export class ChildrensService {
    constructor(@InjectModel(Children) private childrenRepository: typeof Children) {}

    async createChildren(dto: CreateChildren, parent: User): Promise<Children> {
        let children = await this.childrenRepository.findOne({
            where: { id: parent.id, name: dto.name, grade: dto.grade },
        })
        if (!children) children = await this.childrenRepository.create({ ...dto })
        await children.$set('user', parent)
        await parent.$set('childrens', [...parent.childrens, children])
        return children
    }
}
