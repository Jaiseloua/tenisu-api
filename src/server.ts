import { createApp } from './app';
import { config } from './config/env';

const server = createApp().listen(config.port, () => {
  console.log(`Tenisu API listening on port ${config.port} (${config.nodeEnv})`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received, closing server...`);
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
