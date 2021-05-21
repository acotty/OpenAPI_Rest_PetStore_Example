import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  //CreateDateColumn,
  //UpdateDateColumn,
  //OneToOne,
  //OneToMany,
  //JoinColumn
} from "typeorm";

@Entity("tags")
class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

export default Tag;
