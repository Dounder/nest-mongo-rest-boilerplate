import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ENV_CONFIG, JoiValidationSchema } from './config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ENV_CONFIG],
      isGlobal: true,
      validationSchema: JoiValidationSchema,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUri'),
      }),
    }),

    CommonModule,

    UsersModule,

    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
