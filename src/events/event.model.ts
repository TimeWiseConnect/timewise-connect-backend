import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/user.model'
import { UserEvent } from './dto/user-event.dto'
import { ShortEvent } from './dto/event.dto'

interface EventCreationAttrs {
    dateTime: Date
    userId: number
}

@Table({ tableName: 'events', createdAt: false, updatedAt: false })
export class Event extends Model<Event, EventCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Id' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    @Column({ type: DataType.DATE, unique: true, allowNull: false })
    dateTime: Date

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    isAvailable: boolean

    @Column({ type: DataType.STRING })
    name: string

    @Column({ type: DataType.STRING })
    childName: string

    @Column({ type: DataType.INTEGER })
    grade: number

    @Column({ type: DataType.BOOLEAN })
    disability: boolean

    @Column({ type: DataType.TEXT })
    request: string

    @Column({ type: DataType.BOOLEAN })
    call: boolean

    @Column({ type: DataType.BOOLEAN })
    sms: boolean

    @Column({ type: DataType.BOOLEAN })
    messenger: boolean

    @Column({ type: DataType.STRING })
    phone: string

    @Column({ type: DataType.TEXT })
    comment: string

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    userId: number

    convertEventToUserEvent(): UserEvent {
        const { id, dateTime, name, isAvailable, request, phone, grade, userId } = this

        const userEvent: UserEvent = {
            id,
            dateTime,
            name,
            isAvailable,
            request,
            phone,
            grade,
            userId,
        }

        return userEvent
    }

    convertEventToShortEvent(): ShortEvent {
        const { id, dateTime, isAvailable } = this

        const shortEvent: ShortEvent = {
            id,
            dateTime,
            isAvailable,
        }

        return shortEvent
    }
}
