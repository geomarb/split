import { Entity, Column, ObjectIdColumn, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ObjectId } from 'mongodb';

@Entity('users')
export default class UserEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  password: string | undefined;

  @Column({ nullable: false, unique: true })
  email!: string;

  @CreateDateColumn() createdOn?: Date;

  @CreateDateColumn() updatedOn?: Date;

  @Exclude()
  @Column()
  public currentHashedRefreshToken?: string;
}