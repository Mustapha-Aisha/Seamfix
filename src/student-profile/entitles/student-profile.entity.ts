import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

export enum EnrollmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  GRADUATED = 'graduated',
  WITHDRAWN = 'withdrawn',
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  enrollmentStatus: EnrollmentStatus;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn()
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
