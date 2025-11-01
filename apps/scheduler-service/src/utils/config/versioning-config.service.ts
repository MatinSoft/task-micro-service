import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type VersioningStrategy = 'uri' | 'header' | 'both';

@Injectable()
export class VersioningConfigService {
  constructor(private readonly config: ConfigService) {}

  get strategy(): VersioningStrategy {
    return (
      this.config.get<VersioningStrategy>('API_VERSIONING_STRATEGY') ?? 'uri'
    );
  }

  get defaultVersion(): string {
    return this.config.get<string>('API_VERSIONING_DEFAULT') ?? '1';
  }
}