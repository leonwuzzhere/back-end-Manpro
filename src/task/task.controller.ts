import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// import untuk auth & role
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleName } from '../auth/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard) //  semua endpoint di bawah wajib JWT + cek role
@Controller('task')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Pimpinan, Manager, Ketua Divisi boleh membuat task
  @Roles(RoleName.Pimpinan, RoleName.Manager, RoleName.KetuaDivisi)
  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.create(dto);
  }

  // Semua role yang login boleh lihat list task, tapi scope-nya diatur di service
  @Get()
  findAll(@Req() req: any) {
    return this.taskService.findAllForUser(req.user);
  }

  // Detail task juga di-filter sesuai role di service
  @Get(':idtask')
  findOne(
    @Param('idtask', ParseIntPipe) idtask: number,
    @Req() req: any,
  ) {
    return this.taskService.findOneForUser(idtask, req.user);
  }


  // Pimpinan, Manager, Ketua Divisi, dan Staf boleh PATCH
  // (untuk saat ini masih bebas, nanti di service kita batasi:
  //  Staf hanya boleh ubah status task miliknya sendiri)
  @Roles(RoleName.Pimpinan, RoleName.Manager, RoleName.KetuaDivisi, RoleName.Staf)
 @Patch(':idtask')
update(
  @Param('idtask', ParseIntPipe) idtask: number,
  @Body() dto: UpdateTaskDto,
  @Req() req: any,
) {
  return this.taskService.update(idtask, dto, req.user);
}



  // Hapus task: hanya Pimpinan, Manager, Ketua Divisi
  @Roles(RoleName.Pimpinan, RoleName.Manager, RoleName.KetuaDivisi)
@Delete(':idtask')
remove(
  @Param('idtask', ParseIntPipe) idtask: number,
  @Req() req: any,
) {
  return this.taskService.remove(idtask, req.user);
}

}
