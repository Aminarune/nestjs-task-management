import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { User } from '../auth/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  // eslint-disable-next-line
  @ManyToOne(type => User, user => user.tasks, { eager: false })
  user: User;
}
