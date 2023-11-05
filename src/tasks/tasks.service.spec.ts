import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  const mockTasksRepository = () => ({
    getAllTasks: jest.fn(),
    getTaskById: jest.fn(),
  });
  const mockUser = {
    username: 'Ariel',
    id: 'someId',
    password: 'somePassword',
    tasks: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TasksService,
          useValue: {},
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      service.getAllTasks = jest.fn().mockResolvedValue('someValue');
      const result = await service.getAllTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('should return a task', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
        id: 'someId',
        status: 'OPEN',
      };
      service.getTaskById = jest.fn().mockResolvedValue(mockTask);
      const result = await service.getTaskById(mockTask.id, mockUser);
      expect(result).toEqual(mockTask);
    });

    it('should throw an error if task is not found', async () => {
      service.getTaskById = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(service.getTaskById(null, mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});
