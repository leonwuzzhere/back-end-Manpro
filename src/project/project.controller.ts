import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// import tambahan untuk RBAC
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleName } from '../auth/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard) // Semua endpoint di sini butuh token + cek role
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // CREATE PROJECT
  // hanya Pimpinan & Manager yang boleh membuat project
  @Roles(RoleName.Pimpinan, RoleName.Manager)
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    const user = req.user;
    createProjectDto.created_by = user.iduser; // isi otomatis dari token login
    return await this.projectService.create(createProjectDto);
  }

  // GET SEMUA PROJECT
  // semua user yang login boleh melihat list project
  @Get()
  async findAll() {
    return await this.projectService.findAll();
  }

  // GET PROJECT BY ID
  // semua user yang login boleh melihat detail project
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.projectService.findOne(id);
  }

  // UPDATE DATA PROJECT
  // hanya Pimpinan & Manager
  @Roles(RoleName.Pimpinan, RoleName.Manager)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.update(id, updateProjectDto);
  }

  // UPDATE STATUS PROJECT (contoh: /project/1/status/2)
  // hanya Pimpinan & Manager
  @Roles(RoleName.Pimpinan, RoleName.Manager)
  @Put(':id/status/:statusId')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('statusId', ParseIntPipe) statusId: number,
  ) {
    return await this.projectService.updateStatus(id, statusId);
  }

  // DELETE PROJECT
  // hanya Pimpinan & Manager
  @Roles(RoleName.Pimpinan, RoleName.Manager)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.projectService.remove(id);
  }
}
