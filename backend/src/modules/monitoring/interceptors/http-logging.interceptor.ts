import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  LoggerService,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const { method, url, ip } = request;
    const userAgent = request.get("user-agent") || "";
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;
        const contentLength = response.get("content-length");
        const elapsedTime = Date.now() - now;

        const logMessage = {
          method,
          url,
          statusCode,
          contentLength,
          elapsedTime: `${elapsedTime}ms`,
          ip,
          userAgent,
        };

        this.logger.log(logMessage, "HttpRequest");
      }),
    );
  }
}
