import { Test, TestingModule } from '@nestjs/testing';
import { SharedSocketService } from './shared-socket.service';

describe('SharedSocketService', () => {
  let service: SharedSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedSocketService],
    }).compile();

    service = module.get<SharedSocketService>(SharedSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
