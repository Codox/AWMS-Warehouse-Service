import { BaseEntity } from '../shared/base.entity';
import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('audit')
export class Audit extends BaseEntity<Audit> {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({
    name: 'record_id',
    type: 'int',
  })
  recordId: number;

  @Column()
  type: string;

  @Column()
  action: string;

  @Column({
    name: 'old_data',
    type: 'jsonb',
    nullable: true,
  })
  oldData: any;

  @Column({
    name: 'new_data',
    type: 'jsonb',
    nullable: true,
  })
  newData: any;

  @Column({
    name: 'user_uuid',
    type: 'uuid',
  })
  userUuid: string;

  @Column({
    name: 'timestamp',
    type: 'timestamp',
  })
  timestamp: Date;
}
