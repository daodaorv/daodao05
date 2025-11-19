import { Request, Response, NextFunction } from 'express';
export interface ApiError extends Error {
    statusCode?: number;
    code?: number;
    details?: any;
}
export declare function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction): void;
export declare function createError(message: string, statusCode?: number, code?: number, details?: any): ApiError;
//# sourceMappingURL=errorHandler.d.ts.map