import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from '../../../../../../apps/task-service/src/dto/create-task.dto';
import { UpdateTaskDto } from '../../../../../../apps/task-service/src/dto/update-task.dto';
import { TaskEntity, TaskStatus } from '../../../../../../apps/task-service/src/entity/task.entity';
import { AttachmentEntity } from '../../../../../../apps/task-service/src/entity/attachment.entity';
import { PrismaTaskRepository } from './task.repository';

// Mock PrismaService
const mockPrismaService = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  attachment: {
    createMany: jest.fn(),
  },
};

describe('PrismaTaskRepository', () => {
  let repository: PrismaTaskRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaTaskRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrismaTaskRepository>(PrismaTaskRepository);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const mockPrismaTask = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: [],
      };

      mockPrismaService.task.create.mockResolvedValue(mockPrismaTask);

      const result = await repository.create(createTaskDto);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          status: TaskStatus.PENDING,
        },
        include: {
          attachments: true,
        },
      });

      expect(result).toBeInstanceOf(TaskEntity);
      expect(result.id).toBe('1');
      expect(result.title).toBe('Test Task');
      expect(result.status).toBe(TaskStatus.PENDING);
    });

    it('should handle errors when creating a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const error = new Error('Database error');
      mockPrismaService.task.create.mockRejectedValue(error);

      await expect(repository.create(createTaskDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const mockPrismaTasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: TaskStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
          attachments: [],
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          status: TaskStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
          attachments: [],
        },
      ];

      mockPrismaService.task.findMany.mockResolvedValue(mockPrismaTasks);

      const result = await repository.findAll();

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        include: { attachments: true },
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(TaskEntity);
      expect(result[1]).toBeInstanceOf(TaskEntity);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should return empty array when no tasks exist', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a task when found', async () => {
      const mockPrismaTask = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: [],
      };

      mockPrismaService.task.findUnique.mockResolvedValue(mockPrismaTask);

      const result = await repository.findById('1');

      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { attachments: true },
      });

      expect(result).toBeInstanceOf(TaskEntity);
      expect(result?.id).toBe('1');
    });

    it('should return null when task not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      const mockPrismaTask = {
        id: '1',
        title: 'Updated Task',
        description: 'Updated Description',
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: [],
      };

      mockPrismaService.task.update.mockResolvedValue(mockPrismaTask);

      const result = await repository.update('1', updateTaskDto);

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: updateTaskDto.title,
          description: updateTaskDto.description,
        },
        include: {
          attachments: true,
        },
      });

      expect(result).toBeInstanceOf(TaskEntity);
      expect(result.title).toBe('Updated Task');
      expect(result.description).toBe('Updated Description');
    });
  });

  describe('delete', () => {
    it('should delete a task successfully', async () => {
      const mockPrismaTask = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: [],
      };

      mockPrismaService.task.delete.mockResolvedValue(mockPrismaTask);

      const result = await repository.delete('1');

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { attachments: true },
      });

      expect(result).toBeInstanceOf(TaskEntity);
      expect(result.id).toBe('1');
    });
  });

  describe('uploadFiles', () => {
    it('should upload files and create attachments', async () => {
      const taskId = '1';
      const mockFiles = [
        {
          filename: 'file1.txt',
          path: '/uploads/file1.txt',
          size: 1024,
          mimetype: 'text/plain',
        },
        {
          filename: 'file2.jpg',
          path: '/uploads/file2.jpg',
          size: 2048,
          mimetype: 'image/jpeg',
        },
      ] as Express.Multer.File[];

      await repository.uploadFiles(taskId, mockFiles);

      expect(prisma.attachment.createMany).toHaveBeenCalledWith({
        data: [
          {
            taskId: '1',
            filename: 'file1.txt',
            size: 1024,
            mimetype: 'text/plain',
            createdAt: expect.any(Date),
          },
          {
            taskId: '1',
            filename: 'file2.jpg',
            size: 2048,
            mimetype: 'image/jpeg',
            createdAt: expect.any(Date),
          },
        ],
      });
    });

    it('should handle empty files array', async () => {
      const taskId = '1';
      const mockFiles: Express.Multer.File[] = [];

      await repository.uploadFiles(taskId, mockFiles);

      expect(prisma.attachment.createMany).toHaveBeenCalledWith({
        data: [],
      });
    });
  });

  describe('toEntity', () => {
    it('should convert prisma task to TaskEntity with attachments', () => {
      const mockPrismaTask = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        attachments: [
          {
            id: 'att1',
            filename: 'file.txt',
            size: 1024,
            mimetype: 'text/plain',
            createdAt: new Date('2023-01-01'),
            taskId: '1',
          },
        ],
      };

      const result = (repository as any).toEntity(mockPrismaTask);

      expect(result).toBeInstanceOf(TaskEntity);
      expect(result.id).toBe('1');
      expect(result.title).toBe('Test Task');
      expect(result.description).toBe('Test Description');
      expect(result.status).toBe(TaskStatus.PENDING);
      expect(result.attachments).toHaveLength(1);
      expect(result.attachments[0]).toBeInstanceOf(AttachmentEntity);
      expect(result.attachments[0].id).toBe('att1');
      expect(result.attachments[0].filename).toBe('file.txt');
    });

    it('should handle task with no attachments', () => {
      const mockPrismaTask = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        attachments: [],
      };

      const result = (repository as any).toEntity(mockPrismaTask);

      expect(result).toBeInstanceOf(TaskEntity);
      expect(result.attachments).toEqual([]);
    });

    it('should handle task with null description', () => {
      const mockPrismaTask = {
        id: '1',
        title: 'Test Task',
        description: null,
        status: TaskStatus.PENDING,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        attachments: [],
      };

      const result = (repository as any).toEntity(mockPrismaTask);

      expect(result.description).toBeNull();
    });
  });
});