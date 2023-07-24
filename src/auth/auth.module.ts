import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PhoneCodes } from '../phoneCodes/phoneCodes.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { PhoneCodesModule } from 'src/phoneCodes/phoneCodes.module'

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        SequelizeModule.forFeature([PhoneCodes]),
        forwardRef(() => UsersModule),
        PhoneCodesModule,
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '2w',
            },
        }),
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
