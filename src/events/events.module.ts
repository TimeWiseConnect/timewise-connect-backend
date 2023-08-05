import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { EventsService } from './events.service'
import { EventsController } from './events.controller'
import { Event } from './event.model'
import { User } from 'src/users/user.model'
import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'

@Module({
    controllers: [EventsController],
    providers: [EventsService],
    imports: [SequelizeModule.forFeature([Event, User]), AuthModule, UsersModule],
    exports: [EventsService],
})
export class EventsModule {}
