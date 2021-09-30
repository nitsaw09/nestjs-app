import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import JwtPayload from './jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(user: RegisterUserDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    const createdUser = await this.usersService.createUser({
      name: user.name,
      email: user.email,
      password: hash,
    });
    delete createdUser.password;
    return createdUser;
  }

  async userLogin(loginUser: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(loginUser.email);

    const isPasswordMatching = await bcrypt.compare(
      loginUser.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Invalid login credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
    delete user.password;

    // generate and sign token
    const token = this.createToken(user);

    return {
      ...token,
    };
  }

  async validateUser(loginUser: LoginUserDto) {
    const user: any = await this.usersService.getUserByEmail(loginUser.email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private createToken({ id, name, email }: JwtPayload): any {
    const user: JwtPayload = { id, name, email };
    const accessToken = this.jwtService.sign(user);
    return {
      accessToken,
    };
  }
}
