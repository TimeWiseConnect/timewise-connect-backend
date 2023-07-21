import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/user.model'
import { Event } from 'src/events/event.model'

interface ChildrenCreationAttrs {
    name: string
    grade: number
}

@Table({ tableName: 'childrens', createdAt: false, updatedAt: false })
export class Children extends Model<Children, ChildrenCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Id' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    @ApiProperty({ example: 'Виталик', description: 'Child name' })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string

    @ApiProperty({ example: 11, description: `Child's grade` })
    @Column({ type: DataType.INTEGER })
    grade: number

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number

    @BelongsTo(() => User)
    user: User

    @HasMany(() => Event)
    events: Event
}
