import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TaskServiceController } from './task-service.controller';
import { TaskServiceService } from './task-service.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entity/task.entity';
import { TaskStatus } from './entity/task.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

// Mock service
const mockTaskService = {
  create: jest.fn(),
  createV2: jest.fn(),
  getTaskById: jest.fn(),
  getTasks: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  uploadFiles: jest.fn(),
};

describe('TaskServiceController (e2e)', () => {
  let app: INestApplication;
  let service: TaskServiceService;

  // Sample data
  const mockTask: TaskEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    attachments: [],
  };

  const mockTask2: TaskEntity = {
    id: '223e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task 2',
    description: 'Test Description 2',
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    attachments: [],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TaskServiceController],
      providers: [
        {
          provide: TaskServiceService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply global validation pipe to simulate real app behavior
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));

    await app.init();
    service = moduleFixture.get<TaskServiceService>(TaskServiceService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /tasks (V1)', () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
    };

    it('should create a new task successfully', async () => {
      mockTaskService.create.mockResolvedValue(mockTask);

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toEqual({
        ...mockTask,
        createdAt: mockTask.createdAt.toISOString(),
        updatedAt: mockTask.updatedAt.toISOString(),
      });
      expect(mockTaskService.create).toHaveBeenCalledWith(createTaskDto);
    });

    it('should return 400 for invalid input', async () => {
      const invalidDto = { description: 'Only description' }; // Missing title

      await request(app.getHttpServer())
        .post('/tasks')
        .send(invalidDto)
        .expect(400);
    });

    it('should handle service errors', async () => {
      mockTaskService.create.mockRejectedValue(new BadRequestException('Invalid data'));

      await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(400);
    });
  });


  describe('GET /tasks/:id', () => {
    it('should return a task by ID', async () => {
      mockTaskService.getTaskById.mockResolvedValue(mockTask);

      const response = await request(app.getHttpServer())
        .get(`/tasks/${mockTask.id}`)
        .expect(200);

      expect(response.body).toEqual({
        ...mockTask,
        createdAt: mockTask.createdAt.toISOString(),
        updatedAt: mockTask.updatedAt.toISOString(),
      });
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(mockTask.id);
    });

    it('should return 404 for non-existent task', async () => {
      mockTaskService.getTaskById.mockRejectedValue(new NotFoundException('Task not found'));

      await request(app.getHttpServer())
        .get('/tasks/123e4567-e89b-12d3-a456-426614174000')
        .expect(404);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .get('/tasks/invalid-uuid')
        .expect(400);
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      const tasks = [mockTask, mockTask2];
      mockTaskService.getTasks.mockResolvedValue(tasks);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toEqual({
        ...mockTask,
        createdAt: mockTask.createdAt.toISOString(),
        updatedAt: mockTask.updatedAt.toISOString(),
      });
      expect(mockTaskService.getTasks).toHaveBeenCalled();
    });

    it('should return empty array when no tasks exist', async () => {
      mockTaskService.getTasks.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('PATCH /tasks/:id', () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
    };

    const updatedTask: TaskEntity = {
      ...mockTask,
      ...updateTaskDto,
      updatedAt: new Date(),
    };

    it('should update a task successfully', async () => {
      mockTaskService.updateTask.mockResolvedValue(updatedTask);

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${mockTask.id}`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body).toEqual({
        ...updatedTask,
        createdAt: mockTask.createdAt.toISOString(),
        updatedAt: updatedTask.updatedAt.toISOString(),
      });
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(mockTask.id, updateTaskDto);
    });

    it('should return 404 for non-existent task', async () => {
      mockTaskService.updateTask.mockRejectedValue(new NotFoundException('Task not found'));

      await request(app.getHttpServer())
        .patch('/tasks/123e4567-e89b-12d3-a456-426614174000')
        .send(updateTaskDto)
        .expect(404);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .patch('/tasks/invalid-uuid')
        .send(updateTaskDto)
        .expect(400);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task successfully', async () => {
      mockTaskService.deleteTask.mockResolvedValue(mockTask);

      const response = await request(app.getHttpServer())
        .delete(`/tasks/${mockTask.id}`)
        .expect(200);

      expect(response.body).toEqual({
        ...mockTask,
        createdAt: mockTask.createdAt.toISOString(),
        updatedAt: mockTask.updatedAt.toISOString(),
      });
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(mockTask.id);
    });

    it('should return 404 for non-existent task', async () => {
      mockTaskService.deleteTask.mockRejectedValue(new NotFoundException('Task not found'));

      await request(app.getHttpServer())
        .delete('/tasks/123e4567-e89b-12d3-a456-426614174000')
        .expect(404);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .delete('/tasks/invalid-uuid')
        .expect(400);
    });
  });

describe('POST /tasks/:id/upload', () => {
  const taskId = '123e4567-e89b-12d3-a456-426614174000';

  it('should upload files successfully', async () => {
    mockTaskService.uploadFiles.mockResolvedValue({ message: 'Files uploaded successfully' });

    await request(app.getHttpServer())
      .post(`/tasks/${taskId}/upload`)
      .attach('files', Buffer.from('file content'), 'test1.jpg')
      .attach('files', Buffer.from('file content 2'), 'test2.jpg')
      .expect(201);

    // More flexible assertion - just check that uploadFiles was called with correct taskId and files array
    expect(mockTaskService.uploadFiles).toHaveBeenCalledWith(
      taskId,
      expect.arrayContaining([
        expect.objectContaining({
          fieldname: 'files',
          originalname: expect.stringMatching(/test1\.jpg|test2\.jpg/),
          mimetype: 'image/jpeg',
          size: expect.any(Number),
        }),
      ])
    );

    // Additional check for the number of files
    const calledWith = mockTaskService.uploadFiles.mock.calls[0];
    expect(calledWith[0]).toBe(taskId);
    expect(calledWith[1]).toHaveLength(2);
  });

  it('should upload files with correct task ID and file count', async () => {
    mockTaskService.uploadFiles.mockResolvedValue({ message: 'Files uploaded successfully' });

    await request(app.getHttpServer())
      .post(`/tasks/${taskId}/upload`)
      .attach('files', Buffer.from('file1 content'), 'test1.png')
      .attach('files', Buffer.from('file2 content'), 'test2.jpg')
      .expect(201);

    // Check the basic structure without being too specific
    expect(mockTaskService.uploadFiles).toHaveBeenCalledWith(
      taskId,
      expect.arrayContaining([
        expect.objectContaining({
          originalname: 'test1.png',
          mimetype: 'image/png',
        }),
        expect.objectContaining({
          originalname: 'test2.jpg', 
          mimetype: 'image/jpeg',
        }),
      ])
    );
  });
});


});