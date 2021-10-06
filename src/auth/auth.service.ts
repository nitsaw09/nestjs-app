import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async registerUser(user: RegisterUserDto) {
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

  public async userLogin(loginUser: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(loginUser.email);

    const isPasswordMatching = await bcrypt.compare(
      loginUser.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    // generate and sign token
    const token = this.createToken(user);

    return {
      ...token,
    };
  }

  public async validateUser(loginUser: LoginUserDto) {
    const user: any = await this.usersService.getUserByEmail(loginUser.email);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  private async createToken({ id, name, email }: JwtPayload) {
    const user: JwtPayload = { id, name, email };
    const accessToken = await this.jwtService.sign(user);
    return {
      accessToken,
    };
  }
}
