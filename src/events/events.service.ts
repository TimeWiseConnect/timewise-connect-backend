import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateEventDto } from './dto/create-event.dto'
import { Event } from './event.model'
import { AddEventDto } from './dto/add-event.dto'
import { User } from 'src/users/user.model'
import { UsersService } from 'src/users/users.service'
import { UserEvent } from './dto/user-event.dto'
import { ShortEvent } from './dto/event.dto'
import { ChildrensService } from 'src/childrens/childrens.service'

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event) private eventRepository: typeof Event,
        private userService: UsersService,
        private childrenService: ChildrensService,
    ) {}

    async createEvent(dto: CreateEventDto): Promise<Event> {
        let event = await this.eventRepository.findOne({
            where: { dateTime: dto.dateTime },
            // , include: { all: true }
        })
        if (event)
            throw new HttpException(`Event with datetime "${dto.dateTime}" already exists`, HttpStatus.BAD_REQUEST)
        event = await this.eventRepository.create({ ...dto } as any)
        return event
    }

    async addEvent(currentUser: User, dto: AddEventDto, eventId: number): Promise<Event> {
        if (!eventId) throw new HttpException(`No event choosen`, HttpStatus.BAD_REQUEST)
        const event = await this.eventRepository.findOne({
            where: { id: eventId },
            include: { all: true },
        })
        if (!event) throw new HttpException(`Event does not exist`, HttpStatus.BAD_REQUEST)
        if (!event?.isAvailable)
            throw new HttpException(`Event with datetime "${event.dateTime}" already busy`, HttpStatus.BAD_REQUEST)

        let user = await this.userService.getUserById(currentUser?.id)
        if (!user) {
            user = await this.userService.createUser({
                ...dto,
            })
        }
        if (dto.children) {
            const children = await this.childrenService.createChildren(dto.children, user)
            await event.$set('children', children)
        }

        await user.$set('events', [...user.events.map((event) => event.id), event.id])
        await event.$set('user', user)

        event.phone = dto.phone
        event.request = dto.request
        event.name = dto.name
        event.isAvailable = false
        await event.save()

        return event
    }

    async getEvents(currentUser: User) {
        const events = await this.eventRepository.findAll()

        if (currentUser?.roles.some((role) => ['ADMIN'].includes(role.value))) {
            return events
        }

        if (currentUser?.roles.some((role) => ['USER'].includes(role.value))) {
            const userEvents: UserEvent[] = events.map((event) => ({ ...event }))
            return userEvents
        }

        const ShortEvents: ShortEvent[] = events.map((event) => event.convertEventToShortEvent())

        return ShortEvents
    }

    async getEventInfo(id: number): Promise<Event> {
        const event = await this.getEventById(id)
        if (!event) throw new HttpException(`Event not found`, HttpStatus.BAD_REQUEST)
        return event
    }

    async removeEvent(id: number) {
        const event = await this.eventRepository.findOne({ where: { id } })
        await event.destroy()
        return { message: 'Event was removed' }
    }

    async getEventById(id: number) {
        const event = await this.eventRepository.findOne({ where: { id }, include: { all: true } })
        return event
    }

    async approveEvent(id: number): Promise<Event> {
        const event = await this.getEventById(id)
        if (!event) throw new HttpException(`Event not found`, HttpStatus.BAD_REQUEST)
        event.isApproved = true
        return event
    }

    async denyEvent(id: number): Promise<Event> {
        const event = await this.getEventById(id)
        if (!event) throw new HttpException(`Event not found`, HttpStatus.BAD_REQUEST)
        this.clearEvent(id)
        return event
    }

    async clearEvent(id: number): Promise<Event> {
        const event = await this.getEventById(id)
        if (!event) throw new HttpException(`Event not found`, HttpStatus.BAD_REQUEST)
        event.phone = ''
        event.request = ''
        event.name = ''
        event.childGrade = 0
        event.isAvailable = true
        event.isApproved = false
        await event.save()
        return event
    }
}
