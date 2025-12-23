import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  private validateDates(start: Date, end: Date) {
    if (start > end) throw new BadRequestException('start_date tidak boleh lebih besar dari end_date');
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    this.validateDates(dto.start_date, dto.end_date);
    const idstatus_task = dto.idstatus_task ?? 1; // default To Do
    const newTask = this.taskRepository.create({ ...dto, idstatus_task });
    return this.taskRepository.save(newTask);
  }

  // ⬇️ method lama, tetap dipakai internal
  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({ order: { idtask: 'DESC' } });
  }

  // ⬇️ method lama, tetap dipakai internal (update/remove)
  async findOne(idtask: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { idtask } });
    if (!task) throw new NotFoundException(`Task dengan id ${idtask} tidak ditemukan`);
    return task;
  }

  // 🔹 BARU: findAllForUser → dipakai controller GET /task
  async findAllForUser(user: any): Promise<Task[]> {
    if (!user?.roleName) {
      return [];
    }

    // Pimpinan & Manager: lihat semua task
    if (user.roleName === 'Pimpinan' || user.roleName === 'Manager') {
      return this.taskRepository.find({ order: { idtask: 'DESC' } });
    }

    // Ketua Divisi: hanya task di divisinya
    if (user.roleName === 'Ketua Divisi' && user.iddivision) {
      return this.taskRepository.find({
        where: { iddivisi: user.iddivision },
        order: { idtask: 'DESC' },
      });
    }

    // Staf: hanya task yang ditugaskan ke dirinya
    if (user.roleName === 'Staf') {
      return this.taskRepository.find({
        where: { assign_to: user.iduser },
        order: { idtask: 'DESC' },
      });
    }

    // default aman
    return [];
  }

  // 🔹 BARU: findOneForUser → dipakai controller GET /task/:idtask
  async findOneForUser(idtask: number, user: any): Promise<Task> {
    const task = await this.findOne(idtask); // pakai method lama

    // Pimpinan & Manager: boleh lihat semua
    if (user?.roleName === 'Pimpinan' || user?.roleName === 'Manager') {
      return task;
    }

    // Ketua Divisi: hanya task di divisinya
    if (user?.roleName === 'Ketua Divisi') {
      if (user.iddivision && task.iddivisi === user.iddivision) {
        return task;
      }
      throw new NotFoundException('Task tidak ditemukan');
    }

    // Staf: hanya task miliknya sendiri
    if (user?.roleName === 'Staf') {
      if (task.assign_to === user.iduser) {
        return task;
      }
      throw new NotFoundException('Task tidak ditemukan');
    }

    // kalau role aneh/tidak dikenali
    throw new NotFoundException('Task tidak ditemukan');
  }

  // ⬇️ update dan remove tetap seperti versi terakhir yang kita buat (dengan rule Staf & Ketua Divisi)
  async update(idtask: number, dto: UpdateTaskDto, user: any): Promise<Task> {
    const task = await this.findOne(idtask);

    // Jika Staf, batasi hak update
    if (user?.roleName === 'Staf') {
      if (task.assign_to !== user.iduser) {
        throw new ForbiddenException('Staf hanya boleh mengubah tugas yang ditugaskan kepadanya');
      }

      const mencobaUbahFieldLain =
        dto.idproject !== undefined ||
        dto.iddivisi !== undefined ||
        dto.nama_task !== undefined ||
        dto.assign_to !== undefined ||
        dto.start_date !== undefined ||
        dto.end_date !== undefined;

      if (mencobaUbahFieldLain) {
        throw new ForbiddenException('Staf hanya boleh mengubah status tugasnya sendiri');
      }

      if (dto.idstatus_task === undefined) {
        throw new BadRequestException('Staf harus mengirim idstatus_task untuk mengubah status');
      }

      task.idstatus_task = dto.idstatus_task;
      return this.taskRepository.save(task);
    }

    // Ketua Divisi: hanya task di divisinya
    if (user?.roleName === 'Ketua Divisi') {
      if (task.iddivisi !== user.iddivision) {
        throw new ForbiddenException('Ketua Divisi hanya boleh mengelola tugas di dalam divisinya');
      }
      if (dto.iddivisi !== undefined && dto.iddivisi !== user.iddivision) {
        throw new ForbiddenException('Ketua Divisi tidak boleh memindahkan tugas ke divisi lain');
      }
    }

    const start = dto.start_date ?? task.start_date;
    const end = dto.end_date ?? task.end_date;
    this.validateDates(start, end);
    Object.assign(task, dto);
    return this.taskRepository.save(task);
  }

  async remove(idtask: number, user: any): Promise<{ deleted: boolean }> {
    const task = await this.findOne(idtask);

    if (user?.roleName === 'Ketua Divisi') {
      if (task.iddivisi !== user.iddivision) {
        throw new ForbiddenException('Ketua Divisi hanya boleh menghapus tugas di dalam divisinya');
      }
    }

    const res = await this.taskRepository.delete(idtask);
    if (!res.affected) throw new NotFoundException(`Task dengan id ${idtask} tidak ditemukan`);
    return { deleted: true };
  }
}
