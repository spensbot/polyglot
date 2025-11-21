import { z } from 'zod';
import { Result } from './Result';

export const IdleSchema = z.object({ status: z.literal('idle') });
export const LoadingSchema = z.object({ status: z.literal('loading') });
export const SuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({ status: z.literal('success'), val: dataSchema });
export const ErrorSchema = z.object({ status: z.literal('error'), err: z.string() });

export function AsyncStateSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.union([
    IdleSchema,
    LoadingSchema,
    SuccessSchema(dataSchema),
    ErrorSchema,
  ]);
}

export type AsyncState<T> =
  | z.infer<typeof IdleSchema>
  | z.infer<typeof LoadingSchema>
  | { status: 'success'; val: T }
  | z.infer<typeof ErrorSchema>;

export namespace Async {
  export function idle<T>(): AsyncState<T> {
    return { status: 'idle' };
  }

  export function loading<T>(): AsyncState<T> {
    return { status: 'loading' };
  }

  export function success<T>(val: T): AsyncState<T> {
    return { status: 'success', val };
  }

  export function error<T>(err: string): AsyncState<T> {
    return { status: 'error', err: err };
  }

  export function fromResult<T>(result: Result<T>): AsyncState<T> {
    if (result.ok) {
      return success(result.val);
    } else {
      return error(result.err);
    }
  }
}