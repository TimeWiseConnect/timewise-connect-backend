import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Event } from './events/event.model'
import { EventsModule } from './events/events.module'
import { UsersModule } from './users/users.module'
import { RolesModule } from './roles/roles.module'
import { AuthModule } from './auth/auth.module'
import { Role } from './roles/role.model'
import { User } from './users/user.model'
import { UserRoles } from './roles/user-roles.model'
import { PhoneCodes } from './phoneCodes/phoneCodes.model'
import { PhoneCodesModule } from './phoneCodes/phoneCodes.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: 'localhost',
            port: Number(5432),
            username: 'postgres',
            password: '85reheme',
            database: 'tws',
            models: [Event, User, PhoneCodes, Role, UserRoles],
            autoLoadModels: true,
        }),
        UsersModule,
        EventsModule,
        RolesModule,
        AuthModule,
        PhoneCodesModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
