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
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
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
