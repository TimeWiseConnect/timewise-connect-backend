import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Event } from 'src/events/event.model'
import { Role } from 'src/roles/role.model'
import { UserRoles } from 'src/roles/user-roles.model'

interface UserCreationAttrs {
    phone: string
}

@Table({ tableName: 'users', createdAt: false, updatedAt: false })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Id' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    @ApiProperty({ example: '+79801112233', description: 'User phone' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    phone: string

    @ApiProperty({ example: 'Надежда', description: 'User name' })
    @Column({ type: DataType.STRING })
    name: string

    @Column({ type: DataType.STRING })
    avatar: string

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[]

    @HasMany(() => Event)
    events: Event[]
}
