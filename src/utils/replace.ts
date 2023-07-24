import { PhoneCodes } from 'src/phoneCodes/phoneCodes.model'

export const replace = async (
    repo: typeof PhoneCodes,
    data: { ip: string; expiresAt: Date; phone: string; code: string },
) => {
    const { ip, expiresAt, phone, code } = data
    const phoneCode = await repo.findOne({ where: { phone } })
    if (phoneCode) {
        await PhoneCodes.update(
            {
                ip,
                expiresAt: expiresAt,
                code: code,
            },
            { where: { phone } },
        )
        return
    }

    await repo.create({
        phone,
        ip,
        expiresAt: expiresAt,
        code: code,
    })
    return
}
