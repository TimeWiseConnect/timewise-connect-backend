import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LogInDto } from './dto/auth.login.dto'

@ApiTags('Authorization')
@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    login(@Body() userDto: LogInDto) {
        return this.authService.login(userDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    auth(@Req() req) {
        return this.authService.auth(req.user.id)
    }
}
