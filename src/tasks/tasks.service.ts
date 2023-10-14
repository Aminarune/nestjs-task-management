import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getAllTasks(filter: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filter;
    const query = this.tasksRepository.createQueryBuilder('task');
    if (status) query.andWhere('task.status = :status', { status });
    if (search)
      query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', {
        search: `%${search}%`,
      });

    return await query.getMany();
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id: id });
    if (!found) throw new NotFoundException(`Task with ID "${id}" not found`);
    return found;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Task with ID "${id}" not found`);
    return true;
  }

  async createTask(task: CreateTaskDto): Promise<Task> {
    const result = this.tasksRepository.create({ ...task, status: TaskStatus.OPEN });
    await this.tasksRepository.save(result);
    return result;
  }

  async updateTaskStatus(id: string, { status }: UpdateTaskStatusDto): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
