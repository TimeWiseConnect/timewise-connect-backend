import { Body, Controller, Get, Post, Req, UseGuards, Ip, HttpCode } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LogInDto, RegistrationDto, ValidateUserDto } from './dto/auth.dto'

@ApiTags('Authorization')
@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    @HttpCode(200)
    login(@Body() userDto: LogInDto, @Ip() ip) {
        return this.authService.login(userDto, ip)
    }

    @Post('/reg')
    @HttpCode(200)
    registration(@Body() userDto: RegistrationDto, @Ip() ip) {
        return this.authService.registration(userDto, ip)
    }

    @Post('/validate')
    validate(@Body() userDto: ValidateUserDto) {
        return this.authService.validateUser(userDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    auth(@Req() req) {
        return this.authService.auth(req.user.id)
    }
}
