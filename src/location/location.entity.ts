import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Warehouse } from '../warehouse/warehouse.entity';

@Entity('locations')
export class Location extends BaseEntity<Location> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({
    name: 'name',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'float',
  })
  width: number;

  @Column({
    type: 'float',
  })
  height: number;

  @Column({
    type: 'float',
  })
  depth: number;

  @Column({
    default: false,
  })
  disabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
