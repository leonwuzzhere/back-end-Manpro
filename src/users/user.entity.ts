import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'users', schema: 'manprodb' })
export class User {
  @PrimaryGeneratedColumn({ name: 'iduser' })
  iduser: number;

  @Column({ name: 'idrole', type: 'int' })
  idrole: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({ nullable: true })
  iddivision: number;

}
