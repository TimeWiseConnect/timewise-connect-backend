import { Injectable } from '@nestjs/common'
import https from 'https'
import { PhoneCodes } from '../phoneCodes/phoneCodes.model'
import { InjectModel } from '@nestjs/sequelize'
import { replace } from 'src/utils/replace'

@Injectable()
export class PhoneCodesService {
    constructor(@InjectModel(PhoneCodes) private phoneCodesRepository: typeof PhoneCodes) {}

    async getPhoneCode(phone: string): Promise<PhoneCodes> {
        const phoneCode = await this.phoneCodesRepository.findOne({ where: { phone } })
        return phoneCode
    }

    async callUser(phone: string, ip: string) {
        // 'https://sms.ru/code/call?phone=79206747338&ip=33.22.11.55&api_id=4B76CC4D-D91B-3B36-F7E1-A7AB2FEAB058',

        // {
        //     "status": "OK", // Запрос выполнен успешно (нет ошибок в авторизации, проблем с отправителем, итд...)
        //     "code": "1435", // Последние 4 цифры номера, с которого мы совершим звонок пользователю
        //     "call_id": "000000-10000000", // ID звонка
        //     "cost": 0.4, // Стоимость звонка
        //     "balance": 4122.56 // Ваш баланс после совершения звонка
        // }

        // TODO: hide apiID
        const apiId = '4B76CC4D-D91B-3B36-F7E1-A7AB2FEAB058'

        if (ip === '::1') {
            ip = '-1'
        }

        // https
        //     .get(`https://sms.ru/code/call?phone=${phone}&ip=${ip}&api_id=${apiId}`, (res) => {
        //         console.log('statusCode:', res.statusCode)
        //         console.log('headers:', res.headers)

        //         res.on('data', async (d) => {
        //             console.log('headers:', d)
        //             await this.replace(
        //                 this.phoneCodesRepository,
        //                 ip,
        //                 new Date(Date.now() + 1000 * 60 * 5),
        //                 phone,
        //                 d.code,
        //             )
        //         })
        //     })
        //     .on('error', (e) => {
        //         console.error(e)
        //     })

        await replace(this.phoneCodesRepository, {
            ip,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5),
            phone,
            code: '1234',
        })
    }
}
