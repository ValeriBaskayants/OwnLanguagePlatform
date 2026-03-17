import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
    }): unknown;
    login(body: {
        email: string;
        password: string;
    }): unknown;
    getMe(req: any): unknown;
}
