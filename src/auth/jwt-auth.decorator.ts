import { SetMetadata } from '@nestjs/common'

export const CHECK_USER_KEY = 'checkUser'

export const checkUser = () => SetMetadata(CHECK_USER_KEY, true)
