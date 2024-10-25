import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    } from 'typeorm';
  
//   export enum UserRole {
//     SUPERADMIN = 'superadmin',
//     ADMIN = 'admin',
//     STUDENT = 'student',
//     STAFF = 'staff',
//   }
  
  @Entity('user')
  export class UserEntity{
    
    @PrimaryGeneratedColumn({name: 'id'})
    id: string;
  
    @Column({name: 'username',  unique: true })
    username: string;
  
    @Column({name: 'password',})
    password: string;
  
    @Column({name: 'email', unique: true })
    email: string;
  
    @Column({ name: 'role'})
    role: string;
  
    @Column({name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @Column({name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  }
  