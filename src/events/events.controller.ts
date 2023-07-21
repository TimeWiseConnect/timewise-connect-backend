import { Body, Param, Req, Controller, Get, Post, Delete, UseGuards } from '@nestjs/common'
import { EventsService } from './events.service'
import { CreateEventDto } from './dto/create-event.dto'
import { AddEventDto } from './dto/add-event.dto'
import { RolesGuard } from 'src/auth/roles.guard'
import { Roles } from 'src/auth/roles-auth.decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { checkUser } from 'src/auth/jwt-auth.decorator'

@Controller('/api/events')
export class EventsController {
    constructor(private eventService: EventsService) {}

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('/add')
    create(@Body() eventDto: CreateEventDto) {
        return this.eventService.createEvent(eventDto)
    }

    @UseGuards(JwtAuthGuard)
    @checkUser()
    @Post(':id')
    add(@Body() eventDto: AddEventDto, @Req() req, @Param('id') id: number) {
        return this.eventService.addEvent(req?.user, eventDto, id)
    }

    @UseGuards(JwtAuthGuard)
    @checkUser()
    @Get()
    getAll(@Req() req) {
        return this.eventService.getEvents(req?.user)
    }

    @Get(':id')
    get(@Param('id') id: number) {
        return this.eventService.getEventInfo(id)
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('/approve/:id')
    approve(@Param('id') id: number) {
        return this.eventService.approveEvent(id)
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('/deny/:id')
    deny(@Param('id') id: number) {
        return this.eventService.denyEvent(id)
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('/clear/:id')
    clear(@Param('id') id: number) {
        return this.eventService.clearEvent(id)
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.eventService.removeEvent(id)
    }
}
