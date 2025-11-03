import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import * as fs from 'fs';
import { FileSystemService } from './file-system.service';
import { NotFoundException } from '@nestjs/common';

// Mock the entire fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

const VALID_PATH = "valid.file";
const INVALID_PATH = "invalid.file";
const SAMPLE_READ_FILE_RESULT = "hiii";

describe('FileSystemService', () => {
  const rootPath = path.resolve(__dirname, "..", "..");
  let service: FileSystemService;
  let existsSyncMock: jest.MockedFunction<typeof fs.existsSync>;
  let readFileSyncMock: jest.MockedFunction<typeof fs.readFileSync>;
  let unlinkSyncMock: jest.MockedFunction<typeof fs.unlinkSync>;

  beforeEach(async () => {
    // Get the mocked functions
    existsSyncMock = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
    readFileSyncMock = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
    unlinkSyncMock = fs.unlinkSync as jest.MockedFunction<typeof fs.unlinkSync>;

    // Reset all mocks
    jest.clearAllMocks();

    // Setup default mock implementations
    existsSyncMock.mockImplementation((filePath: string) => {
      const filename = path.basename(filePath);
      return filename === VALID_PATH;
    });

    readFileSyncMock.mockImplementation((filePath: string) => {
      return Buffer.from(SAMPLE_READ_FILE_RESULT);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [FileSystemService],
    }).compile();

    service = module.get<FileSystemService>(FileSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should have rootPath property equal to root path of project", () => {
    expect(service.rootPath).toBe(rootPath);
  });

  describe("delete method", () => {
    it("should be defined", () => {
      expect(service.delete).toBeDefined();
    });

    it("should check if given file exists", () => {
      service.delete(INVALID_PATH);
      
      // Verify existsSync was called with the correct path
      expect(existsSyncMock).toHaveBeenCalledWith(
        path.resolve(service.rootPath, INVALID_PATH)
      );
      
      // Verify unlinkSync was NOT called for invalid path
      expect(unlinkSyncMock).not.toHaveBeenCalled();
    });

    it("should remove file if path is valid", () => {
      service.delete(VALID_PATH);
      
      expect(existsSyncMock).toHaveBeenCalledWith(
        path.resolve(service.rootPath, VALID_PATH)
      );
      expect(unlinkSyncMock).toHaveBeenCalledWith(
        path.resolve(service.rootPath, VALID_PATH)
      );
    });
  });

  describe("readFile method", () => {
    it("should be defined", () => {
      expect(service.readFile).toBeDefined();
    });

    it("should throw NotFoundException if file does not exist", () => {
      // Setup the mock to return false for invalid path
      existsSyncMock.mockReturnValueOnce(false);

      expect(() => { 
        service.readFile(INVALID_PATH); 
      }).toThrow(NotFoundException);
    });

    it("should call fs.readFileSync with expected args when file exists", () => {
      service.readFile(VALID_PATH);

      expect(readFileSyncMock).toHaveBeenCalledWith(
        path.resolve(service.rootPath, VALID_PATH)
      );
    });

    it("should return expected values", () => {
      const result = service.readFile(VALID_PATH);

      expect(result).toBe(SAMPLE_READ_FILE_RESULT);
    });
  });

  // Additional edge case tests
  describe("edge cases", () => {
    it("should handle nested paths correctly", () => {
      const nestedPath = "subfolder/valid.file";
      
      // Mock existsSync to return true for this specific test
      existsSyncMock.mockReturnValueOnce(true);
      
      service.delete(nestedPath);
      
      expect(existsSyncMock).toHaveBeenCalledWith(
        path.resolve(service.rootPath, nestedPath)
      );
    });

    it("should handle empty file content", () => {
      const emptyFilePath = "empty.file";
      
      // Mock for this specific test
      existsSyncMock.mockReturnValueOnce(true);
      readFileSyncMock.mockReturnValueOnce(Buffer.from(""));
      
      const result = service.readFile(emptyFilePath);
      
      expect(result).toBe("");
    });
  });
});