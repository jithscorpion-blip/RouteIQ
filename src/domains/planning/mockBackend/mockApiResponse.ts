export type MockApiResult<T> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

export const ok = <T>(data: T, status = 200): MockApiResult<T> => ({ ok: true, status, data });

export const fail = (code: string, message: string, status = 400): MockApiResult<never> => ({
  ok: false,
  status,
  error: { code, message },
});
