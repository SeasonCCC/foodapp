/*
 * @Author: Season
 * @Date: 2020-04-07 21:10:04
 * @LastEditTime: 2020-05-18 16:06:33
 * @LastEditors: Please set LastEditors
 * @FilePath: \api\src\users\users.controller.ts
 */
import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Param,
  Request,
} from '@nestjs/common';
import UsersService from './users.service';
import ValidationPipe from '../shared/validation.pipe';
import { UsersDto, UpdateTypeDto, ChangePassowrdDto } from './users.dto';
// import AuthGuard from '../shared/auth.guard';
import { User } from './users.decorator';
// import LocalAuthGuard from '../shared/guard/local-auth.guard';
import JwtAuthGuard from '../shared/guard/jwt-auth.guard';

@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {
    this.usersService = usersService;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllUsers(@Request() req) {
    console.log(req.user);
    return this.usersService.getAllUsers();
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // getAllUsers() {
  //   return this.usersService.getAllUsers();
  // }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  // @UseGuards(LocalAuthGuard)
  login(@Body() data: UsersDto) {
    return this.usersService.login(data);
  }

  // @Post('login')
  // @UsePipes(new ValidationPipe())
  // login(@Body() data: UsersDto) {
  //   return this.usersService.login(data);
  // }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UsersDto) {
    return this.usersService.register(data);
  }

  @Post('updateType')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  updateType(@Body() data: UpdateTypeDto) {
    return this.usersService.updateType(data);
  }

  @Post('changePassword')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() data: ChangePassowrdDto, @User('id') id: string) {
    return this.usersService.changePassword(data, id);
  }

  @Post('resetPassword')
  @UsePipes(new ValidationPipe())
  resetPassword(@Body('id') id: string) {
    // return id
    return this.usersService.resetPassword(id);
  }
}
