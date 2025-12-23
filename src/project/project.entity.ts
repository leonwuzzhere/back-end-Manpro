import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'project', schema: 'manprodb' })
export class Project {
  @PrimaryGeneratedColumn()
  idproject: number;

  @Column({ length: 100 })
  project_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'int', default: 1 })
  idstatus: number;

  @Column({ nullable: true })
  assigned_to: number;

  // Kolom foreign key di database
  @Column({ nullable: true })
  created_by: number;

  // Relasi ManyToOne ke user pembuat
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;
}
