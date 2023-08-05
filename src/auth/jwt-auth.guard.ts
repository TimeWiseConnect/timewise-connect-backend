import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { CHECK_USER_KEY } from './jwt-auth.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const checkUser = this.reflector.get<boolean>(CHECK_USER_KEY, context.getHandler())
            const authHeader = req.headers?.authorization
            if (checkUser) return this.checkUser(authHeader, req)
            return this.defaultGuard(authHeader, req)
        } catch (e) {
            console.log(e)
            throw new UnauthorizedException(e.message)
        }
    }

    defaultGuard = (authHeader: string, req) => {
        if (!authHeader) throw new UnauthorizedException('Unauthorized')

        const bearer = authHeader.split(' ')[0]
        const token = authHeader.split(' ')[1]

        if (bearer !== 'Bearer' || !token) throw new UnauthorizedException('Unauthorized')

        const user = this.jwtService.verify(token)

        req.user = user
        return true
    }

    checkUser = (authHeader: string, req) => {
        console.log(authHeader)
        if (!authHeader) {
            req.user = null
            return true
        }

        const bearer = authHeader.split(' ')[0]
        const token = authHeader.split(' ')[1]

        if (bearer !== 'Bearer' || !token) {
            req.user = null
            return true
        }

        const user = this.jwtService.verify(token)

        req.user = user
        return true
    }
}
