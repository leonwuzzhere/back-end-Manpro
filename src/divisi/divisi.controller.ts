import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DivisiService } from './divisi.service';
import { CreateDivisiDto } from './dto/create-divisi.dto';
import { UpdateDivisiDto } from './dto/update-divisi.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// import tambahan untuk RBAC
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleName } from '../auth/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('divisi')
export class DivisiController {
  constructor(private readonly divisiService: DivisiService) {}

  // CREATE DIVISI — hanya Pimpinan & Manager
  @Roles(RoleName.Pimpinan, RoleName.Manager)
  @Post()
  async create(@Body() createDivisiDto: CreateDivisiDto) {
    return await this.divisiService.create(createDivisiDto);
  }

  // GET ALL DIVISI — semua user yang login boleh melihat
  @Get()
  async findAll() {
    return await this.divisiService.findAll();
  }

  // GET DIVISI BY ID — semua user yang login boleh melihat
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.divisiService.findOne(id);
  }

  // UPDATE DIVISI — hanya Pimpinan & Manager
  @Roles(RoleName.Pimpinan, RoleName.Manager)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDivisiDto: UpdateDivisiDto,
  ) {
    return await this.divisiService.update(id, updateDivisiDto);
  }

  // DELETE DIVISI — hanya Pimpinan & Manager
  @Roles(RoleName.Pimpinan, RoleName.Manager)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.divisiService.remove(id);
  }
}
