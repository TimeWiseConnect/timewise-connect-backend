import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ChildrensController } from './childrens.controller'
import { ChildrensService } from './childrens.service'
import { Children } from './children.model'
import { User } from 'src/users/user.model'

@Module({
    controllers: [ChildrensController],
    providers: [ChildrensService],
    imports: [SequelizeModule.forFeature([Children, User])],
    exports: [ChildrensService],
})
export class ChildrensModule {}
