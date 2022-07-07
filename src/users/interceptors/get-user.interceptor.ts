import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../users.service";

@Injectable()
export class GetUserInterceptor implements NestInterceptor{
    constructor(private userService: UsersService){}
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
       const request = context.switchToHttp().getRequest();
       const {userId} = request.session || {};
       if(userId) {
        const user = await this.userService.findUser(userId);
        request.user = user;
       }
       return next.handle();
    }
    
}