import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'task', schema: 'manprodb' })
export class Task {
  @PrimaryGeneratedColumn()
  idtask: number;

  // FK ke project (numerik, tanpa relasi ke entity Project)
  @Column({ type: 'int', name: 'idproject' })
  idproject: number;

  // FK ke divisi
  @Column({ type: 'int', name: 'iddivisi' })
  iddivisi: number;

  @Column({ type: 'varchar', length: 200, name: 'nama_task' })
  nama_task: string;

  // assign ke staff (simply numeric user id)
  @Column({ type: 'int', name: 'assign_to' })
  assign_to: number;

  @Column({ type: 'date', name: 'start_date' })
  start_date: Date;

  @Column({ type: 'date', name: 'end_date' })
  end_date: Date;

  // FK ke status_task (tanpa relasi)
  @Column({ type: 'int', name: 'idstatus_task' })
  idstatus_task: number;
}
