import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Exclude } from 'class-transformer';

@Entity('companies')
export class Company extends BaseEntity<Company> {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({
    length: 10,
    unique: true,
  })
  code: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'vat_number',
    nullable: true,
  })
  vatNumber: string;

  @Column({
    name: 'eori_number',
    nullable: true,
  })
  eoriNumber: string;

  @Column({
    default: true,
  })
  active: boolean;

  @Column({
    name: 'licences_admin',
    default: 2,
  })
  adminLicences: number;

  @Column({
    name: 'licences_warehouse',
    default: 5,
  })
  warehouseLicences: number;

  @Column({
    name: 'contact_telephone',
  })
  contactTelephone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
