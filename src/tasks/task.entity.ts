import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

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
}
