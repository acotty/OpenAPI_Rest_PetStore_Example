import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("orders")
class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  petId: number;

  @Column()
  quantity: number;

  @UpdateDateColumn()
  shipDate: Date;

  @Column()
  status: string;

  @Column()
  complete: boolean;
}

export default Order;
