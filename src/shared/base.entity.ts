export class BaseEntity<T> {
  public constructor(init?: Partial<T>) {
    Object.assign(this, init);
  }
}
