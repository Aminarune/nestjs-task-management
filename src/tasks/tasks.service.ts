import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getAllTasks(filter: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filter;
    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user });
    if (status) query.andWhere('task.status = :status', { status });
    if (search)
      query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', {
        search: `%${search}%`,
      });

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filter)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      const found = await this.tasksRepository.findOneBy({ id, user });
      if (!found) throw new NotFoundException(`Task with ID "${id}" not found`);
      return found;
    } catch (error) {
      this.logger.error(`Failed to get task by ID "${id}" for user "${user.username}"`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async deleteTask(id: string, user: User): Promise<boolean> {
    try {
      const result = await this.tasksRepository.delete({ id, user });
      if (result.affected === 0) {
        throw new NotFoundException(`Task with ID "${id}" not found`);
      }
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete task by ID "${id}" for user "${user.username}"`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createTask(task: CreateTaskDto, user: User): Promise<Task> {
    try {
      const result = this.tasksRepository.create({ ...task, status: TaskStatus.OPEN, user });
      await this.tasksRepository.save(result);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to create task for user "${user.username}". Data: ${JSON.stringify(task)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async updateTaskStatus(id: string, { status }: UpdateTaskStatusDto, user: User): Promise<Task> {
    try {
      const task = await this.getTaskById(id, user);
      task.status = status;
      await this.tasksRepository.save(task);
      return task;
    } catch (error) {
      this.logger.error(`Failed to update task by ID "${id}" for user "${user.username}"`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
