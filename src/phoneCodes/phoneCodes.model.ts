import { Column, DataType, Model, Table } from 'sequelize-typescript'

interface PhoneCodeCreationAttrs {
    ip: string
    phone: string
    expiresAt: Date
    code: string
}

@Table({ tableName: 'phone_codes', createdAt: false, updatedAt: false })
export class PhoneCodes extends Model<PhoneCodes, PhoneCodeCreationAttrs> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    @Column({ type: DataType.STRING, unique: true })
    phone: string

    @Column({ type: DataType.DATE, allowNull: false })
    expiresAt: Date

    @Column({ type: DataType.STRING, allowNull: false })
    code: string

    @Column({ type: DataType.STRING, allowNull: false })
    ip: string
}
