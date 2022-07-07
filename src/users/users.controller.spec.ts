import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  beforeEach(async () => {
    fakeUsersService = {
      findUser: (id: number) =>
        Promise.resolve({
          id,
          email: 'abc@gmail.com',
          password: 'sdfskdf',
        } as User),
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'sdfskdf' } as User]);
      },
      // remove: (id) => {
      //   return Promise.resolve();
      // },
      // update: () => {},
    };
    fakeAuthService = {
      // signUp: () => {},
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('findAllUser returns a list of users with the given email', async () => {
    const users = await controller.findAllUser('abc@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('abc@gmail.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser(1);
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with the given id is not foudn', () => {
    fakeUsersService.findUser = () => null;
    expect(controller.findUser(7)).toEqual(null);
  });

  it('signin updates session object and return user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      {
        email: 'abc@example.com',
        password: 'sdsdf',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
