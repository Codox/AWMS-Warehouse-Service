export class BaseResponse<T> {
  data: T | T[];
  count: number;
  page: number;
  limit: number;
}
