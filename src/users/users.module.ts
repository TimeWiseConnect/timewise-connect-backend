import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from 'src/auth/auth.module'
import { Role } from 'src/roles/role.model'
import { RolesModule } from 'src/roles/roles.module'
import { UserRoles } from 'src/roles/user-roles.model'
import { User } from './user.model'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { Event } from 'src/events/event.model'
import { EventsModule } from 'src/events/events.module'

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Event, Role, UserRoles]),
        forwardRef(() => EventsModule),
        RolesModule,
        forwardRef(() => AuthModule),
    ],
    exports: [UsersService],
})
export class UsersModule {}
