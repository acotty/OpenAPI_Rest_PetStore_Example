import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  //CreateDateColumn,
  //UpdateDateColumn,
  //OneToOne,
  //OneToMany,
  ManyToMany,
  //JoinColumn
} from "typeorm";

import Pet from "./Pet";

@Entity("tags")
class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(_type => Pet, pet => pet.tags,)
  pets: Pet[];
}

export default Tag;
