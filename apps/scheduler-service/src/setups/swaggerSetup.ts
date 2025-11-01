import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function getVersionFromPath(path: string): string | null {
    const parts = path.split('/').filter(Boolean);
    for (const part of parts) {
      const m = part.match(/^v(\d+)$/i);
      if (m) return m[1];
    }
    return null;
  }

const swaggerInitialize = (app: INestApplication) => {
    const versions = ['1', '2'];

    versions.forEach((version) => {
        const config = new DocumentBuilder()
            .setTitle('Task Service API')
            .setDescription(
                `**Version ${version}** of the Task Service API.\n\n` +
                (version === '1'
                    ? 'Basic CRUD operations.'
                    : 'Enhanced version with new features.'),
            )
            .setVersion(version)
            .addTag('tasks')
            .build();

        // Generate full OpenAPI document
        const document = SwaggerModule.createDocument(app, config, {
            operationIdFactory: (controllerKey: string, methodKey: string) =>
                `${version}_${methodKey}`,
        });

        // FILTER: Only keep operations where @Version(version) matches
        const filteredPaths: Record<string, any> = {};

        Object.entries(document.paths).forEach(([path, pathItem]) => {
            const methods: Record<string, any> = {};

            Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
                const operationVersion = operation.operationId.split("_")[0]
                if (operationVersion === version && getVersionFromPath(path) == version) {
                    methods[method] = operation;
                }
            });

            if (Object.keys(methods).length > 0) {
                filteredPaths[path] = { ...pathItem, ...methods };
            }
        });

        const filteredDocument = {
            ...document,
            paths: filteredPaths,
        };

        // Setup Swagger UI
        SwaggerModule.setup(`api/task-service-api/v${version}`, app, filteredDocument, {
            swaggerOptions: {
                persistAuthorization: false,
                docExpansion: 'list',
                filter: true,
                showRequestDuration: true,
            },
            customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info { margin: 20px 0 }
      `,
            customSiteTitle: `Task Service API v${version}`,
        });
    });

    // Landing page
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/api', (req, res) => {
        res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Task Service API</title>
          <meta charset="utf-8"/>
          <style>
            body { font-family: 'Segoe UI', sans-serif; margin: 40px; background: #f9f9fb; color: #333; }
            .container { max-width: 600px; margin: auto; }
            h1 { text-align: center; color: #2c3e50; }
            .card { background: white; padding: 25px; margin: 20px 0; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: center; }
            .card h3 { margin: 0 0 10px; color: #2c3e50; }
            .card p { margin: 8px 0; color: #7f8c8d; font-size: 0.95em; }
            a { display: block; padding: 14px; background: #3498db; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 15px; transition: 0.2s; }
            a:hover { background: #2980b9; transform: translateY(-1px); }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Task Service API</h1>
            <p style="text-align:center;color:#555;">Select your API version:</p>
            ${versions
                .map(
                    (v) => `
                <div class="card">
                  <h3>API v${v}</h3>
                  <p>${v === '1' ? 'Basic CRUD operations' : 'Enhanced with new features'}</p>
                  <a href="/api/task-service-api/v${v}">Open Documentation</a>
                </div>`,
                )
                .join('')}
          </div>
        </body>
      </html>
    `);
    });
};

export { swaggerInitialize };