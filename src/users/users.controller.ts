import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('list')
  getAllUser() {
    return this.usersService.getAllUser();
  }

  @Get(':userId')
  getUser(@Param() getUserParams: GetUserFilterDto) {
    const { userId } = getUserParams;
    return this.usersService.getUser(userId);
  }

  @Patch(':id')
  updateUser(
    @Param() getUserParams: GetUserFilterDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { userId } = getUserParams;
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param() getUserParams: GetUserFilterDto) {
    const { userId } = getUserParams;
    return this.usersService.deleteUser(userId);
  }
}
