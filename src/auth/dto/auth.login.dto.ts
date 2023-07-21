import { ApiProperty } from '@nestjs/swagger'

export class LogInDto {
    @ApiProperty({ example: '+79801112233', description: 'User phone number' })
    readonly phone: string
}
