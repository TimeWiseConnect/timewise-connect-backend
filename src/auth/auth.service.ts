import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/users/user.model'
import { LogInDto, RegistrationDto, ValidateUserDto } from './dto/auth.dto'
import { PhoneCodesService } from 'src/phoneCodes/phoneCodes.service'

@Injectable()
export class AuthService {
    constructor(
        private phoneCodesService: PhoneCodesService,
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async registration(userDto: RegistrationDto, userIp: string) {
        const phone = userDto.phone.replace(/\D/g, '')
        if (phone.length !== 11) throw new HttpException(`Укажите корректный номер телефона`, HttpStatus.BAD_REQUEST)
        if (!userDto.name) throw new HttpException(`Укажите ваше имя`, HttpStatus.BAD_REQUEST)

        const candidate = await this.userService.getUserByPhone(phone)
        if (candidate)
            throw new HttpException(`Пользователь с номером "${userDto.phone}" уже существует`, HttpStatus.BAD_REQUEST)

        await this.userService.createUser({
            ...userDto,
            phone: phone,
        })

        this.phoneCodesService.callUser(phone, userIp)
        return
    }

    async login(userDto: LogInDto, userIp: string) {
        const phone = userDto.phone.replace(/\D/g, '')

        if (phone.length !== 11) throw new HttpException(`Укажите корректный номер телефона`, HttpStatus.BAD_REQUEST)

        const user = await this.userService.getUserByPhone(phone)
        if (!user) throw new HttpException(`Пользователь не найден`, HttpStatus.BAD_REQUEST)

        this.phoneCodesService.callUser(phone, userIp)
        return
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

    async validateUser(userDto: ValidateUserDto): Promise<any> {
        const phone = userDto.phone.replace(/\D/g, '')
        if (phone.length !== 11) throw new HttpException(`Указан некорректный номер телефона`, HttpStatus.BAD_REQUEST)

        const user = await this.userService.getUserByPhone(phone)
        if (!user) throw new HttpException(`Пользователь не найден`, HttpStatus.BAD_REQUEST)
        const phoneCode = await this.phoneCodesService.getPhoneCode(phone)

        if (new Date() > phoneCode?.expiresAt) throw new HttpException(`Код истек`, HttpStatus.BAD_REQUEST)
        if (userDto.code !== phoneCode?.code) throw new HttpException(`Некорректный код`, HttpStatus.BAD_REQUEST)

        phoneCode.destroy()

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
