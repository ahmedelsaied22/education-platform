import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";

@Injectable()
export class SuccessHandler implements NestInterceptor {
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
        map((res) => {
        const { data = {}, msg = 'success', status = 200 } = res;
        return {
          msg,
          data: data,
          status,
        };
      }),
      );
  }
}