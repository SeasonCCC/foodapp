import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';

import Users from './users.entity';
import {
  UsersDto,
  UpdateTypeDto,
  ChangePassowrdDto,
} from './users.dto';

@Injectable()
export default class UsersService {
  // constructor(
  //   @InjectRepository(Users)
  //   private usersRepository: MongoRepository<Users>,
  // ) {
  //   this.usersRepository = usersRepository
  // }
  @InjectRepository(Users)
  private usersRepository: MongoRepository<Users>

  // private jwtService: JwtService

  constructor(
    private readonly jwtService: JwtService,
  ) {
    this.jwtService = jwtService;
  }

  async getAllUsers() {
    // const users = await this.usersRepository.find();
    // return users;

    const users = await this.usersRepository
      .aggregateEntity([
        {
          $lookup: {
            from: 'news',
            localField: '_id',
            foreignField: 'authorId',
            as: 'news',
          },
        },
      ])
      .toArray();

    return users.map((user) => user);
  }

  async findOne(id: string) {
    const user = await this.usersRepository
      .aggregateEntity([
        {
          $lookup: {
            from: 'news',
            localField: '_id',
            foreignField: 'authorId',
            as: 'news',
          },
        },
        {
          $match: { _id: ObjectId(id) },
        },
      ])
      .toArray();

    return user[0];
  }

  async login(data: UsersDto): Promise<{token: string}> {
    const { username, password, type } = data;

    const user = await this.usersRepository.findOne({ where: { username, type } });

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password/type',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      token: this.jwtService.sign({ username: user.username, sub: user.id }),
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await user.comparePassword(pass))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // async login(data: UsersDto): Promise<UsersRO> {
  //   const { username, password } = data;

  //   const user = await this.usersRepository.findOne({ where: { username } });
  //   if (!user || !(await user.comparePassword(password))) {
  //     throw new HttpException(
  //       'Invalid username/password',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   return user.toResponseObject(true);
  // }

  async register(data: UsersDto) {
    const { username } = data;
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (user) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }

    const users = await this.usersRepository.create(data);

    await this.usersRepository.save(users);
    const userInserted = await this.usersRepository.findOne({
      where: { username },
    });

    return userInserted;
  }

  async updateType(data: UpdateTypeDto) {
    const user = await this.usersRepository.findOne(data.id);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    user.type = data.type;
    await this.usersRepository.save(user);

    return user;
  }

  async changePassword(data: ChangePassowrdDto, id: string) {
    const { oldPassword, newPassword } = data;
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
    }

    if (oldPassword === newPassword) {
      throw new HttpException(
        'New password cannot be equal to old password',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!(await user.comparePassword(oldPassword))) {
      throw new HttpException('Invalid old password', HttpStatus.BAD_REQUEST);
    }

    user.password = newPassword;
    user.hashPassword();
    await this.usersRepository.save(user);

    return user;
  }

  async resetPassword(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
    }

    user.password = '123456';
    user.hashPassword();
    await this.usersRepository.save(user);

    return user;
  }
}
