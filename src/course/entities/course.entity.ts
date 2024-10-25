import { UserEntity } from "src/user/entities/user.entity"
import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

export class Course {

    @PrimaryGeneratedColumn()
    id: string  
    
    @Column({name: 'Course_name'})
    name: string 
    
    @Column({name: 'Course_desc'})
    desc: string 
    
    @Column({name: 'Course_unit'})
    unit: string    

    @OneToMany(() => UserEntity, user => user.id, { onDelete: 'CASCADE' })
    instructor?: UserEntity;

}
