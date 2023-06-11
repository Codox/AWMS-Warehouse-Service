export class CreatedEvent {
  public readonly type: string = 'created';
  public readonly createdAt: Date = new Date();
}
