// Simple Zod resolver for react-hook-form
import { z } from 'zod';
import type { FieldValues } from 'react-hook-form';

export function zodResolver<T extends z.ZodType<any, any>>(schema: T) {
  return async (values: FieldValues) => {
    try {
      const result = await schema.parseAsync(values);
      return { values: result, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, { type: string; message: string }> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = {
            type: err.code,
            message: err.message,
          };
        });
        return { values: {}, errors };
      }
      throw error;
    }
  };
}

