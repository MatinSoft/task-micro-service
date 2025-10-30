import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as mimeTypes from 'mime-types';


@Injectable()
export class FileSystemService {
  private _rootPath: string

  constructor() {
    this._rootPath = path.resolve(__dirname, '..', '..')
  }

  get rootPath(): string {
    return this._rootPath
  }

  isExists(path: string): boolean {
    const isExists = fs.existsSync(path)
    return isExists
  }

  delete(path: string): void {
    const filePath = this.joinPath(path)
    const isExists = fs.existsSync(filePath)

    if (isExists && path.length) {
      fs.unlinkSync(filePath)
    }
  }

  deleteDir(path: string): string[] {
    if (!this.isExists(path)) return []
    const files = fs.readdirSync(path);
    return files
  }
  joinPath(...paths: string[]): string {
    return path.resolve(this._rootPath, ...paths)
  }

  readFile(path: string): string {
    const filePath = this.joinPath(path)
    const isExists = fs.existsSync(filePath)

    if (!isExists) {
      throw new NotFoundException()
    }

    return fs.readFileSync(filePath).toString()
  }

  writeFile(content: string, path: string): void {
    const filePath = this.joinPath(path)
    const isExists = fs.existsSync(filePath)

    if (!isExists) {
      throw new NotFoundException()
    }

    fs.writeFileSync(filePath, content)
  }

  createFile(path: string, content: string = ""): void {
    const filePath = this.joinPath(path)

    fs.writeFileSync(filePath, content)
  }

  move(filePath: string, destination: string): string | null {
    const path = this.joinPath(filePath)
    const isFileExists = fs.existsSync(filePath)

    if (!isFileExists) {
      throw new NotFoundException()
    }

    const destinationPath = this.joinPath(destination)
    const fileName = this.getFileName(filePath)
    const newfilePath = destination + "/" + fileName


    try {
      fs.renameSync(path, destinationPath + "/" + fileName)

      return newfilePath
    } catch (error) {

      return null
    }
  }

  rename(filePath: string, newFilePath: string): string | null{
    const path = this.joinPath(filePath)
    const isFileExists = fs.existsSync(filePath)

    if (!isFileExists) {
      throw new NotFoundException()
    }

    const destinationPath = this.joinPath(newFilePath)

    try {
      fs.renameSync(path, destinationPath)

      return newFilePath
    } catch (error) {

      return null
    }
  }

  getContentTypeByFileName(fileName: string) {
    return mimeTypes.lookup(fileName);
  }

  getSize = (path: string): number => {
    const filePath = this.joinPath(path)

    const isExists = fs.existsSync(filePath)

    if (!isExists) {
      throw new NotFoundException()
    }

    const fileState = fs.statSync(filePath)

    return fileState.size
  }

  getFileName(filePath: string): string {
    return filePath.split("/").reverse()[0]
  }

  getFileExtension(filePath: string): string {
    return filePath.split(".").reverse()[0]
  }
}
