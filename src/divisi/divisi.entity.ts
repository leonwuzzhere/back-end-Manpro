import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../project/project.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'divisi', schema: 'manprodb' })
export class Divisi {
  @PrimaryGeneratedColumn()
  iddivisi: number;

  @Column({ length: 100 })
  nama_divisi: string;

  @Column({ type: 'text', nullable: true })
  main_task: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'int', nullable: true })
  idstatus: number;

  // Relasi ke koordinator (User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'koordinator' })
  koordinator: User;

  // Relasi ke Project
  @ManyToOne(() => Project)
  @JoinColumn({ name: 'idproject' })
  project: Project;
}
