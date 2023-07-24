import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { PhoneCodes } from './phoneCodes.model'
import { PhoneCodesService } from './phoneCodes.service'

@Module({
    providers: [PhoneCodesService],
    imports: [SequelizeModule.forFeature([PhoneCodes])],
    exports: [PhoneCodesService],
})
export class PhoneCodesModule {}
