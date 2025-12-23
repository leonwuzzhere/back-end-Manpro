import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Divisi } from './divisi.entity';
import { DivisiService } from './divisi.service';
import { DivisiController } from './divisi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Divisi])],
  providers: [DivisiService],
  controllers: [DivisiController],
})
export class DivisiModule {}
