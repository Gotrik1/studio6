import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private logLevels: LogLevel[] = ['log', 'warn', 'error'];

  constructor(logLevel?: LogLevel) {
    if (logLevel) {
      this.setLogLevels(this.mapLogLevel(logLevel));
    }
  }

  log(message: any, context?: string) {
    if (!this.isLevelEnabled('log')) return;
    this.printMessage(message, 'log', context);
  }

  error(message: any, trace?: string, context?: string) {
    if (!this.isLevelEnabled('error')) return;
    this.printMessage(message, 'error', context, trace);
  }

  warn(message: any, context?: string) {
    if (!this.isLevelEnabled('warn')) return;
    this.printMessage(message, 'warn', context);
  }

  debug(message: any, context?: string) {
    if (!this.isLevelEnabled('debug')) return;
    this.printMessage(message, 'debug', context);
  }

  verbose(message: any, context?: string) {
    if (!this.isLevelEnabled('verbose')) return;
    this.printMessage(message, 'verbose', context);
  }

  setLogLevels(levels: LogLevel[]) {
    this.logLevels = levels;
  }

  private isLevelEnabled(level: LogLevel): boolean {
    return this.logLevels.includes(level);
  }
  
  private mapLogLevel(level: LogLevel): LogLevel[] {
      const allLevels: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error'];
      const index = allLevels.indexOf(level);
      return allLevels.slice(index);
  }

  private printMessage(
    message: any,
    level: LogLevel,
    context?: string,
    trace?: string,
  ) {
    const logObject = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      trace,
    };
    process.stdout.write(`${JSON.stringify(logObject)}\n`);
  }
}
