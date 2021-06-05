import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from "typeorm";

import Address from "./Address";

@Entity("users")
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  userName: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({unique: true})
  phone: string;

  @OneToOne(_type => Address)
  @JoinColumn()
  addressID: Address;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;

  @Column()
  userStatus: number;
}

export default User;
