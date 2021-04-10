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
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  level: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  username: string;

  @Column("text")
  message: string;
}

export default LogMessage;
