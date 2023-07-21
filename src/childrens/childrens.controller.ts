import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ChildrensService } from './childrens.service'

@ApiTags('Childrens')
@Controller('/api/childrens')
export class ChildrensController {
    constructor(private userService: ChildrensService) {}
}
