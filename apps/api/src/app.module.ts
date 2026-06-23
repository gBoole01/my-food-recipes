import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DietitianAgentModule } from './agents/dietitian-agent/dietitian-agent.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { ProfileModule } from './profile/profile.module';
import { RecipesModule } from './recipes/recipes.module';
import { SeasonalityModule } from './seasonality/seasonality.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    DietitianAgentModule,
    NutritionModule,
    ProfileModule,
    RecipesModule,
    SeasonalityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
