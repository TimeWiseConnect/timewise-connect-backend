import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({ example: '+79801112233', description: 'User phone number' })
    readonly phone: string

    @ApiProperty({ example: 'Надежда', description: 'User name' })
    readonly name: string
}
