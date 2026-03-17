import { ExecutionContext } from '@nestjs/common';
declare const JwtAuthGuard_base: any;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    canActivate(context: ExecutionContext): any;
    handleRequest(err: any, user: any): any;
}
export {};
