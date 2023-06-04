import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from '../shared/base.entity';

@Entity('warehouses')
export class Warehouse extends BaseEntity<Warehouse> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({
    name: 'company_uuid',
    nullable: false,
    type: 'uuid',
  })
  companyUuid: string;

  @Column()
  name: string;

  @Column({
    name: 'contact_telephone',
    nullable: true,
  })
  contactTelephone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
