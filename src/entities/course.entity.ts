import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Section } from "./section.entity";
import { Order } from "./order.entity";
import { Review } from "./review.entity";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;

    @Column()
    description?: string;

    @OneToMany(() => Section, (section) => section.course)
    sections?: Section[];

    @ManyToMany(() => User, (user) => user.enrolledCourses)
    @JoinTable({ name: "student_enrolled_courses" })
    students?: User[];

    @ManyToMany(() => Order, (order) => order.courses)
    orders?: Order[];

    @OneToMany(() => Review, (review) => review.course)
    reviews?: Review[];
}