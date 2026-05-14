import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pratica, PraticaSchema } from './schemas/pratica.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(process.env.MONGO_URI!),

    MongooseModule.forFeature([{ name: Pratica.name, schema: PraticaSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }