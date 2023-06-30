import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Exclude } from 'class-transformer';
import { Mixin } from 'ts-mixer';
import { DangerousGoodsClassification } from './dangerous-goods-classification.entity';

@Entity('dangerous_goods')
export class DangerousGoods extends Mixin(BaseEntity) {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({
    name: 'un_class',
  })
  UNClass: string;

  @OneToMany(
    () => DangerousGoodsClassification,
    (classification) => classification.dangerousGoods,
  )
  classifications: DangerousGoodsClassification[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
