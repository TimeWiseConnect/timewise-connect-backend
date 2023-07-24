import { ApiProperty } from '@nestjs/swagger'

export class LogInDto {
    @ApiProperty({ example: '+79801112233', description: 'User phone number' })
    readonly phone: string
}

export class RegistrationDto {
    @ApiProperty({ example: '+79801112233', description: 'User phone number' })
    readonly phone: string

    @ApiProperty({ example: 'Надежда', description: 'User name' })
    readonly name: string
}

export class ValidateUserDto {
    @ApiProperty({ example: '79801112233', description: 'User phone number' })
    readonly phone: string

    @ApiProperty({ example: '1522', description: 'Code' })
    readonly code: string
}
