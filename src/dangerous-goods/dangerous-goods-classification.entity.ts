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
import { Exclude } from 'class-transformer';
import { Mixin } from 'ts-mixer';
import { DangerousGoods } from './dangerous-goods.entity';

@Entity('dangerous_goods_classifications')
export class DangerousGoodsClassification extends Mixin(BaseEntity) {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  division: string;

  @ManyToOne(() => DangerousGoods)
  @JoinColumn({ name: 'dangerous_goods_id' })
  dangerousGoods: DangerousGoods;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
