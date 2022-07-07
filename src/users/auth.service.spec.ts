import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('asasdf@sdf.com', '34vsd');
    expect(user.password).not.toEqual('sdfsd');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws an error if user signs up with email that is in user', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'foo@bar.com' } as User]);
    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      'email already in use',
    );
  });

  it('throws if signin is called with an un used email', async () => {
    fakeUsersService.find = () => Promise.resolve([]);
    await expect(service.signIn('asdf@asdf.com', 'asdf')).rejects.toThrow(
      'user not found',
    );
  });

  it('throws if an invalid password is provide', async () => {
    const user = await service.signUp('asasdf@sdf.com', '34vsd');
    fakeUsersService.find = () =>
      Promise.resolve([{ email: 'foo@bar.com', password: 'fsdfsdf' } as User]);
    await expect(service.signIn('asdf@asdf.com', 'asdf')).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('return user if correct password is provide', async () => {
    await service.signUp('asasdf@sdf.com', '34vsd');
    const user = await service.signIn('asasdf@sdf.com', '34vsd');
    expect(user).toBeDefined();
  });
});
