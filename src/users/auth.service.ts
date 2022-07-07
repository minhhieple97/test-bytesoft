import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
    constructor(private userService: UsersService){
        
    }
  async  signUp(email:string,password:string){
       const users = await this.userService.find(email);
       if(users.length) throw new BadRequestException('email already in use');
       const salt = randomBytes(8).toString('hex');
       const hash = (await scrypt(password, salt,32)) as Buffer;
       const result = salt + '.' + hash.toString('hex');
       return this.userService.create(email,result);
    }
    async signIn(email:string,password:string){
      const [user] = await this.userService.find(email);
      if(!user) throw new NotFoundException('user not found');
      const [salt,storeHash] = user.password.split('.');
      const hash = (await scrypt(password,salt,32)) as Buffer;
      if(storeHash === hash.toString('hex')) return user;
      throw new UnauthorizedException('Unauthorized');
    }
}