import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Section } from "./section.entity";
import { Order } from "./order.entity";
import { Review } from "./review.entity";

class Image {
    @Column({ default: '' })
    public_id?: string;

    @Column({ default: '' })
    secure_url?: string;
}

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;

    @Column()
    description?: string;

    @Column(() => Image)
    image?: Image; 

    @OneToMany(() => Section, (section) => section.course)
    sections?: Section[];

    @ManyToMany(() => User, (user) => user.enrolledCourses)
    @JoinTable({ name: "student_enrolled_courses" })
    students?: User[];

    @ManyToOne(() => User, (user) => user.instructorCourses)
    @JoinColumn({ name: 'instructorId'})
    instructor?: User;

    @ManyToMany(() => Order, (order) => order.courses)
    orders?: Order[];

    @OneToMany(() => Review, (review) => review.course)
    reviews?: Review[];
}