import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  //CreateDateColumn,
  //UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn
} from "typeorm";

import Category from "./Category";
import Order from "./Order";
import Tag from "./Tag";
import User from "./User";

@Entity("pets")
class Pet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true
  })
  photoUrls: string;

  @Column()
  status: string;

  @OneToOne(type => Category)
  @JoinColumn()
  categoryID: Category;

  @OneToOne(type => Tag)
  @JoinColumn()
  tags: Tag;

  @OneToOne(type => User)
  @JoinColumn()
  userID: User;

  @OneToMany(type => Order, order => order.id)
  orderID: Order[];
}

export default Pet;
