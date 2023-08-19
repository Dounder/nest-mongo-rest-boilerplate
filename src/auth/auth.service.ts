import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { ExceptionHandler } from '../common/helpers';
import { User } from '../users/entities/user.entity';
import { SignInDto, SignUpDto } from './dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthResponse, JwtPayload } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshToken>,

    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    try {
      const { password, ...data } = signUpDto;
      const user = await this.userModel.create({ ...data, password: bcrypt.hashSync(password, 10) });

      const token = await this.checkIfUserHasToken(user.id);

      await this.refreshTokenModel.create({ token, userId: user.id });

      return { token, user };
    } catch (error) {
      ExceptionHandler(error);
    }
  }

  async signIn({ email, password }: SignInDto): Promise<AuthResponse> {
    const user = await this.userModel.findOne({ email });

    if (!user) throw new UnauthorizedException(`Invalid credentials`);

    if (user.deletedAt) throw new UnauthorizedException(`User is inactive, please contact support`);

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException(`Invalid credentials`);

    const token = await this.checkIfUserHasToken(user.id);

    await this.refreshTokenModel.create({ token, userId: user.id });

    return { token: this.createToken(user.id), user };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    const { token } = refreshTokenDto;
    const { id, exp } = this.jwtService.verify(token) as JwtPayload;

    const user = await this.validateUser(id);

    const storedToken = await this.refreshTokenModel.findOne({ token, userId: user.id });

    if (!storedToken) throw new UnauthorizedException(`Invalid refresh token`);

    if (!this.tokenIsAboutToExpire(exp)) throw new BadRequestException(`Token is not about to expire`);

    const newToken = await this.checkIfUserHasToken(user.id);

    await this.refreshTokenModel.create({ userId: user.id, token: newToken });

    return { token: newToken, user };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });

    if (user.deletedAt) throw new UnauthorizedException(`User is inactive, please contact support`);

    return user;
  }

  private createToken(id: string) {
    return this.jwtService.sign({ id });
  }

  private async checkIfUserHasToken(id: string) {
    const userHasToken = await this.refreshTokenModel.findOne({ userId: id });

    if (userHasToken) await this.refreshTokenModel.deleteOne({ _id: userHasToken.id });

    return this.createToken(id);
  }

  private tokenIsAboutToExpire(exp: number): boolean {
    const currentTimestamp = Math.floor(Date.now() / 1000); // Convert current datetime to UNIX timestamp (seconds)
    const timeUntilExpiration = exp - currentTimestamp;

    return timeUntilExpiration <= 3600; // 1 hour
  }
}
