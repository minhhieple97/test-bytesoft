import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import {
  Serialize,
  SerializeInterceptor,
} from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
// import { GetUserInterceptor } from './interceptors/get-user.interceptor';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/:id')
  findUser(@Param('id') id: number) {
    console.log('Router handler is running');
    return this.userService.findUser(id);
  }
  @Get()
  findAllUser(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() newUser: UpdateUserDto) {
    return this.userService.update(id, newUser);
  }

  @Post('/signup')
  async signUp(@Body() user: CreateUserDto, @Session() session: any) {
    const data = await this.authService.signUp(user.email, user.password);
    session.userId = data.id;
    return data;
  }

  @Post('/signin')
  async signIn(@Body() user: CreateUserDto, @Session() session: any) {
    const data = await this.authService.signIn(user.email, user.password);
    session.userId = data.id;
    return data;
  }

  @Post('/whoimi')
  @UseGuards(AuthGuard)
  getColors(@GetUser() user: User) {
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }
}
