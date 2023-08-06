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
    @Post(':id')
    add(@Body() eventDto: AddEventDto, @Req() req, @Param('id') id: number) {
        return this.eventService.addEvent(req.user, eventDto, id)
    }

    @UseGuards(JwtAuthGuard)
    @checkUser()
    @Get()
    getAll(@Req() req) {
        return this.eventService.getEvents(req?.user)
    }

    @UseGuards(JwtAuthGuard)
    @checkUser()
    @Get(':id')
    get(@Param('id') id: number, @Req() req) {
        return this.eventService.getEventInfo(id, req?.user)
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'USER')
    @Post('/clear/:id')
    clear(@Param('id') id: number, @Req() req) {
        return this.eventService.clearEvent(id, req.user)
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.eventService.removeEvent(id)
    }
}
