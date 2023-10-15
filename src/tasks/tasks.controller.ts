import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private service: TasksService) {}

  @Get()
  getAllTasks(@Query() filter: GetTaskFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filter)}`);
    return this.service.getAllTasks(filter, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" retrieving task with ID "${id}"`);
    return this.service.getTaskById(id, user);
  }

  @Post()
  createTask(@Body() task: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(task)}`);
    return this.service.createTask(task, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user): Promise<boolean> {
    this.logger.verbose(`User "${user.username}" deleting task with ID "${id}"`);
    return this.service.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(@Param('id') id: string, @Body() status: UpdateTaskStatusDto, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" updating task with ID "${id}" with status "${status}"`);
    return this.service.updateTaskStatus(id, status, user);
  }
}
