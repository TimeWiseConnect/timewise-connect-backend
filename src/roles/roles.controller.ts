import { Controller, Get, Param } from '@nestjs/common'
import { RolesService } from './roles.service'

@Controller('/api/roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    // @Post()
    // create(@Body() dto: CreateRoleDto) {
    //     return this.roleService.createRole(dto)
    // }

    // @Get('/:value')
    // getByValue(@Param('value') value: string) {
    //     return this.roleService.getRoleByValue(value)
    // }
}
