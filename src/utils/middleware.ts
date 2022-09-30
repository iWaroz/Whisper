import type { Request, Response, NextFunction } from 'express';

export const validateQuery = (...fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const data = req.query;
        for (const field of fields) {
            if (!data[field]) {
                return res
                    .status(400)
                    .json({error: "missing one or more required parameters"})
                    .end();
            }
        }
        next();
    };
}

