import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Create a mock type for the UserEntity repository
const mockRepository = {
  create: jest.fn(), // No need to provide a return value here
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
};

// Type assertion for the mock repository
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository, // Use the mocked repository
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should create a user', async () => {
    const mockUser = {
      username: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: 'student',
    };

    // Mock the repository's create and save methods
    userRepository.create.mockReturnValue(mockUser);  // Mocking create method
    userRepository.save.mockResolvedValue(mockUser);  // Mocking save method

    // Test the service's create method
    const result = await service.create({
      username: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      role: 'student',
    });

    // Assertions
    expect(result).toEqual(mockUser);
    expect(userRepository.create).toHaveBeenCalledWith({
      username: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      role: 'student',
    });
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
  });


  it("should return all users", async () => {
    const mockUsers = [
      {
        username: 'John Doe',
        email: 'john@gmail.com',
        password: 'hashedpassword',
        role: 'superadmin',
      },
      {
        username: 'Jane Doe',
        email: 'jane@gmail.com',
        password: 'hashedpassword',
        role: 'student',
      },
      {
        username: 'Bobby Mustapha',
        email: 'bobby@gmail.com',
        password: 'hashedpassword',
        role: 'staff',
      },
      {
        username: 'jeremiah Doe',
        email: 'jeremiah@gmail.com',
        password: 'hashedpassword',
        role: 'admin',
      }
    ];

    userRepository.find.mockResolvedValue(mockUsers);

    const result = await service.findAll()

    expect(result).toEqual(mockUsers);
    expect(userRepository.find).toHaveBeenCalled();
  });


  it('should login a user', async () => {
    const mockUser = {
      username: 'John Doe',
      password: 'hashedpassword',
    };

    const mockUserFromDb = {
      id: 1,
      username: 'John Doe',
      password: 'hashedpassword',
      email: 'jDoe@gmail.com',
      role: 'student',
      createdAt : "2024-10-22T09:51:59.951Z",
      updatedAt : "2024-10-22T09:51:59.951Z"

    };

    userRepository.findOne.mockResolvedValue(mockUserFromDb);
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

    const result = await service.login(mockUser);

    expect(result).toEqual(mockUserFromDb);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: 'John Doe' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('hashedpassword', 'hashedpassword');
  
     
  });


  it('should reset a user password', async () => {
    const mockUser = {
      email: 'jDoe@gmail.com',
      password: 'hashonlypassword',
      confirmPassword: 'hashonlypassword',

    };

    const mockUserFromDb ={
      id: 1,
      username: 'John Doe',
      password: 'hashonlypassword',
      email: 'jDoe@gmail.com',
      role: 'student',
    }

    userRepository.findOne.mockResolvedValue(mockUserFromDb);

    const result = await service.passwordReset(mockUser);


    expect(result).toEqual(mockUserFromDb);
    expect(result.password).toEqual('hashonlypassword');
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'jDoe@gmail.com' } });
    // expect(result.password).toEqu÷al(result.confirmPassword);





    });
});
