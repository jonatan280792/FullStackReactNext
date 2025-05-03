export class Ok<T> {
  readonly type = 'ok';

  constructor(public readonly value: T) {}

  match<R>(ok: (val: T) => R, _err: (err: string, statusCode?: number) => R): R {
    return ok(this.value);
  }

  isOk(): this is Ok<T> {
    return true;
  }
}

export class Err {
  readonly type = 'err';

  constructor(
    public readonly error: string,
    public readonly statusCode: number = 400, // Default HTTP 400 Bad Request
  ) {}

  match<R>(_ok: (val: any) => R, err: (err: string, statusCode?: number) => R): R {
    return err(this.error, this.statusCode);
  }

  isErr(): this is Err {
    return true;
  }
}

export type Result<T> = Ok<T> | Err;

export const ok = <T>(val: T): Result<T> => new Ok(val);
export const err = (msg: string, statusCode: number = 400): Result<never> => new Err(msg, statusCode);