import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  // CREATE PROJECT (status default = 1 -> In Progress)
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const newProject = this.projectRepository.create({
      ...createProjectDto,
      idstatus: 1, // default status = In Progress
    });
    return await this.projectRepository.save(newProject);
  }

  // READ - semua project
  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['creator'],

      order: { idproject: 'ASC' },
    });
  }

  // READ - project berdasarkan id
  async findOne(idproject: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { idproject },
      relations: ['creator'],

    });
    if (!project) {
      throw new NotFoundException(`Project dengan ID ${idproject} tidak ditemukan`);
    }
    return project;
  }

  // UPDATE PROJECT (edit data umum)
  async update(idproject: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(idproject);
    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  // UPDATE STATUS PROJECT (ubah ke In Progress / Completed)
  async updateStatus(idproject: number, idstatus: number): Promise<Project> {
    const project = await this.findOne(idproject);
    if (![1, 2].includes(idstatus)) {
      throw new NotFoundException('Status tidak valid. Gunakan 1 (In Progress) atau 2 (Completed)');
    }

    project.idstatus = idstatus;
    return await this.projectRepository.save(project);
  }

  // DELETE PROJECT
  async remove(idproject: number): Promise<void> {
    const result = await this.projectRepository.delete(idproject);
    if (result.affected === 0) {
      throw new NotFoundException(`Project dengan ID ${idproject} tidak ditemukan`);
    }
  }
}
 