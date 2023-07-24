import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RolesService } from 'src/roles/roles.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.model'

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User, private roleService: RolesService) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        const user = await this.userRepository.create(dto)
        const role = await this.roleService.getRoleByValue('USER')
        await user.$set('roles', [role.id])
        user.roles = [role]
        return user
    }

    async getUserByPhone(phone: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { phone }, include: { all: true } })
        return user
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id }, include: { all: true } })
        return user
    }

    // async editUserInfo(currentUser: User, newUserInfo: User) {
    //     if (newUserInfo.username == null) throw new BadRequestException(`Username couldn't be empty`)
    //     let user = await this.getUserById(currentUser.id)
    //     if (user.username != newUserInfo.username.toLowerCase()) {
    //         var candidate = await this.getUserByUsername(newUserInfo.username.toLowerCase())
    //         if (candidate?.username) throw new BadRequestException(`Username "${candidate.username}" already exists`)
    //     }
    //     user.username = newUserInfo.username
    //     user.description = newUserInfo.description
    //     await user.save()
    //     return {
    //         user: {
    //             id: user.id,
    //             username: user.username,
    //             description: user.description,
    //         },
    //     }
    // }
}
