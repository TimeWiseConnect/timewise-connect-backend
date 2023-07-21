import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/user.model'
import { UserEvent } from './dto/user-event.dto'
import { ShortEvent } from './dto/event.dto'
import { Children } from 'src/childrens/children.model'

interface EventCreationAttrs {
    dateTime: Date
    userId: number
}

@Table({ tableName: 'events', createdAt: false, updatedAt: false })
export class Event extends Model<Event, EventCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Id' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    // @ApiProperty({ example: 'email@email.com', description: 'User email' })
    @Column({ type: DataType.STRING })
    name: string

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    isAvailable: boolean

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isApproved: boolean

    // @ApiProperty({ example: 'qwerty', description: 'User password' })
    @Column({ type: DataType.TEXT })
    request: string

    @Column({ type: DataType.DATE, unique: true, allowNull: false })
    dateTime: Date

    @Column({ type: DataType.STRING })
    phone: string

    @Column({ type: DataType.INTEGER })
    childGrade: number

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    userId: number

    @BelongsTo(() => Children)
    children: Children

    @ForeignKey(() => Children)
    @Column({ type: DataType.INTEGER, allowNull: true })
    childrenId: number

    convertEventToUserEvent(event: Event): UserEvent {
        const { id, dateTime, name, isApproved, isAvailable, request, phone, childGrade } = event

        const userEvent: UserEvent = {
            id,
            dateTime,
            name,
            isApproved,
            isAvailable,
            request,
            phone,
            childGrade,
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
