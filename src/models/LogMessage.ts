import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("logMessages")
class LogMessage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @CreateDateColumn()
  loggedDate: Date;

  @Column()
  level: string;

  @Column("text")
  message: string;
}

export default LogMessage;
