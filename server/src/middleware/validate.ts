import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Creates an Express middleware that validates `req.body` against a Zod schema.
 *
 * @param schema - Any Zod schema to validate the request body against.
 * @returns Express middleware that either passes control or returns 400 with validation errors.
 *
 * @example
 * ```ts
 * router.post('/items', validate(CreateItemSchema), controller.create);
 * ```
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Parse and replace body with the validated (and potentially transformed) value
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
        return;
      }
      next(error);
    }
  };
}
