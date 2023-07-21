import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/user.model'
import { LogInDto } from './dto/auth.login.dto'

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) {}

    async registration(userDto: CreateUserDto) {
        if (userDto.phone == '') throw new HttpException(`Phone is empty`, HttpStatus.BAD_REQUEST)
        const candidate = await this.userService.getUserByPhone(userDto.phone)
        if (candidate)
            throw new HttpException(`User with phone "${userDto.phone}" already exists`, HttpStatus.BAD_REQUEST)
        const user = await this.userService.createUser({
            ...userDto,
        })

        const { token } = this.generateToken(user)
        return {
            token,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
            },
        }
    }

    async login(userDto: LogInDto) {
        if (!userDto.phone) {
            throw new HttpException(`No phone number provided`, HttpStatus.BAD_REQUEST)
        }
        let user = await this.userService.getUserByPhone(userDto.phone)
        if (!user) {
            // TODO: get user name
            user = await this.userService.createUser({
                ...userDto,
                name: 'Name',
            })
        }
        // TODO: send SMS with code
        const { token } = this.generateToken(user)
        return {
            token,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
            },
        }
    }

    async auth(userId: number) {
        const user = await this.userService.getUserById(userId)
        const { token } = this.generateToken(user)
        return {
            token,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
            },
        }
    }

    generateToken(user: User) {
        const payload = { id: user.id, phone: user.phone, roles: user.roles }
        return {
            token: this.jwtService.sign(payload),
        }
    }
}
