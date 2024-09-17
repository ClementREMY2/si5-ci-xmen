import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { DependenciesConfig } from './shared/config/interfaces/dependencies-config.interface';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Retrieve config service
  const configService = app.get(ConfigService);
  
  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  
  // Proxy endpoints
  const dependenciesConfig = configService.get<DependenciesConfig>('dependencies');
  console.log(`http://${dependenciesConfig.menu_service_url_with_port}`);
  app.use('/menu', (req, res, next) => {
    console.log('Accès à /menu');
    next(); // Passe au middleware suivant (dans ce cas, le proxy)
  });
  
  app.use('/menu', createProxyMiddleware({
    target: `http://0.0.0.0:3000/doc/menus`,
    changeOrigin: true,
  }));
  app.use('/kitchen', createProxyMiddleware({
    target: `http://${dependenciesConfig.kitchen_service_url_with_port}`,
    changeOrigin: true,
  }));
  app.use('/dining', createProxyMiddleware({
    target: `http://${dependenciesConfig.dining_service_url_with_port}`,
    changeOrigin: true,
  }));

  // Run the app
  const appPort = configService.get('app.port');
  await app.listen(appPort);
}
bootstrap();
