import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  //CreateDateColumn,
  //UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable
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

  @Column({nullable: true})
  photoUrls: string;

  @Column()
  status: string;

  @OneToOne(_type => Category)
  @JoinColumn()
  categoryID: Category;

  @ManyToMany(type => Tag, tag => tag.pets, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @OneToOne(_type => User)
  @JoinColumn()
  userID: User;

  @OneToMany(type => Order, Order => Order.id)
  orderID: Order[];
}

export default Pet;
