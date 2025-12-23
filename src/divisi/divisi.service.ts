import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Divisi } from './divisi.entity';
import { CreateDivisiDto } from './dto/create-divisi.dto';
import { UpdateDivisiDto } from './dto/update-divisi.dto';

@Injectable()
export class DivisiService {
  constructor(
    @InjectRepository(Divisi)
    private readonly divisiRepository: Repository<Divisi>,
  ) {}

  // CREATE
async create(createDivisiDto: CreateDivisiDto): Promise<Divisi> {
  // Ambil field relasi dari DTO
  const { koordinator, idproject, ...divisiData } = createDivisiDto;

  // Buat objek baru dari DTO
  const newDivisi = this.divisiRepository.create(divisiData);

  // Ubah integer jadi relasi entity 
  if (koordinator) {
    (newDivisi as any).koordinator = { iduser: koordinator };
  }
  if (idproject) {
    (newDivisi as any).project = { idproject };
  }

  // Simpan ke database
  return await this.divisiRepository.save(newDivisi);
}

  // GET ALL
  async findAll(): Promise<Divisi[]> {
    return await this.divisiRepository.find({
      relations: ['project', 'koordinator'],
      order: { iddivisi: 'ASC' },
    });
  }

  // GET BY ID
  async findOne(iddivisi: number): Promise<Divisi> {
    const divisi = await this.divisiRepository.findOne({
      where: { iddivisi },
      relations: ['project', 'koordinator'],
    });
    if (!divisi) {
      throw new NotFoundException(`Divisi dengan ID ${iddivisi} tidak ditemukan`);
    }
    return divisi;
  }

  // UPDATE
  async update(iddivisi: number, updateDivisiDto: UpdateDivisiDto): Promise<Divisi> {
    const divisi = await this.findOne(iddivisi);
    Object.assign(divisi, updateDivisiDto);
    return await this.divisiRepository.save(divisi);
  }

  // DELETE
  async remove(iddivisi: number): Promise<void> {
    const result = await this.divisiRepository.delete(iddivisi);
    if (result.affected === 0) {
      throw new NotFoundException(`Divisi dengan ID ${iddivisi} tidak ditemukan`);
    }
  }
}
