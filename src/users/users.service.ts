import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepositor:Repository<User>){

    }
    create(email:string,password:string){
        const user = this.userRepositor.create({email:email,password:password});
        return this.userRepositor.save(user);
    }
    findUser(userId:number){
        if(!userId) return null;
        return this.userRepositor.findOneBy({id:userId});
    }
    find(email:string){
        return this.userRepositor.findBy({email:email});
    }
   async update(id:number,user:Partial<User>){
        const checkUserExists = await this.userRepositor.findOneBy({email:user.email});
        if(checkUserExists) throw new NotFoundException('email has already register');
        const newUser = {...checkUserExists,...user};
        return this.userRepositor.save(newUser);
    }
    async remove(id:number){
        const checkUserExists = await this.userRepositor.findOneBy({id});
        if(!checkUserExists) throw new NotFoundException('user does not exist');
    }
}
