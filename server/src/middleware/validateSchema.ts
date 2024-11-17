import { NextFunction, Request, RequestHandler, Response } from 'express';
import { z } from 'zod';

export const validateSchema = (schema: z.ZodSchema<RequestHandler>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedData = schema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ errors: parsedData.error.errors });
    }
    req.body = parsedData.data;
    next();
  };
};

// TODO: Implement a middleware function that validates the request body against a given schema instead of repeating the same code in multiple controllers
