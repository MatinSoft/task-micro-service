import { INestApplication, VersioningType } from "@nestjs/common"
import { VersioningConfigService } from "../utils/config/versioning-config.service";

const apiVersioning = (app: INestApplication) => {
  const versioningCfg = app.get(VersioningConfigService);

  if (['uri', 'both'].includes(versioningCfg.strategy)) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: versioningCfg.defaultVersion,
    });
  }

  if (versioningCfg.strategy == "header") {
    app.enableVersioning({
      type: VersioningType.HEADER,
      header: 'x-api-version',
      defaultVersion: versioningCfg.defaultVersion,
    });
  }

}

export { apiVersioning }