import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateEventDto } from './dto/create-event.dto'
import { Event } from './event.model'
import { AddEventDto } from './dto/add-event.dto'
import { User } from 'src/users/user.model'
import { UsersService } from 'src/users/users.service'
import { UserEvent } from './dto/user-event.dto'
import { ShortEvent } from './dto/event.dto'

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event) private eventRepository: typeof Event, private userService: UsersService) {}

    async createEvent(dto: CreateEventDto): Promise<Event> {
        const date = new Date(dto.dateTime)
        if (date.toString() === 'Invalid Date') throw new HttpException(`Некорректное время`, HttpStatus.BAD_REQUEST)
        let event = await this.eventRepository.findOne({
            where: { dateTime: dto.dateTime },
        })
        // TODO: Добавить проверку на пересечение окон
        if (event) throw new HttpException(`Окно с этим временем уже занято`, HttpStatus.BAD_REQUEST)
        event = await this.eventRepository.create({ ...dto })
        return event
    }

    async addEvent(currentUser: User, dto: AddEventDto, eventId: number): Promise<Event> {
        if (!eventId) throw new HttpException(`Окно для записи не выбрано`, HttpStatus.BAD_REQUEST)
        const event = await this.eventRepository.findOne({
            where: { id: eventId },
            include: { all: true },
        })
        if (!event) throw new HttpException(`Такого окна для записи не существует`, HttpStatus.BAD_REQUEST)
        if (!event?.isAvailable) throw new HttpException(`Окно с этим временем уже занято`, HttpStatus.BAD_REQUEST)

        const user = await this.userService.getUserById(currentUser?.id)
        if (!user?.name) user.name = dto.name

        await user.$set('events', [...user.events.map((event) => event.id), event.id])
        await event.$set('user', user)

        event.phone = dto.phone
        event.request = dto.request
        event.name = dto.name
        event.childName = dto.childName
        event.disability = dto.disability
        event.grade = dto.grade
        event.isAvailable = false
        event.call = dto.call
        event.sms = dto.sms
        event.messenger = dto.messenger
        event.comment = dto.comment
        await event.save()
        await user.save()

        return event
    }

    async getEvents(currentUser: User) {
        const events = await this.eventRepository.findAll()

        if (currentUser?.roles.some((role) => ['ADMIN'].includes(role.value))) {
            return events
        }

        if (currentUser?.roles.some((role) => ['USER'].includes(role.value))) {
            const userEvents: UserEvent[] = events.map((event) => event.convertEventToUserEvent())
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

    async clearEvent(id: number, currentUser: User): Promise<Event> {
        const event = await this.getEventById(id)
        if (!event) throw new HttpException(`Event not found`, HttpStatus.BAD_REQUEST)

        if (!(currentUser.roles.some((role) => role.value === 'ADMIN') || event.userId === currentUser.id))
            throw new ForbiddenException('GAGA')

        event.phone = null
        event.request = null
        event.name = null
        event.childName = null
        event.disability = null
        event.grade = null
        event.call = null
        event.sms = null
        event.messenger = null
        event.comment = null
        event.isAvailable = true
        if (event.userId) {
            const user = await this.userService.getUserById(event.userId)
            await user.$set('events', [...user.events.filter((userEvent) => event.id !== userEvent.id)])
            await event.$set('user', null)
        }
        await event.save()
        return event
    }
}
