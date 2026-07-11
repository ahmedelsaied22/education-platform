import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Section } from "./section.entity";
import { Order } from "./order.entity";

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

    // @ManyToOne(() => User, (user) => user.courses, { onDelete: "CASCADE" })
    // @JoinColumn({ name: "instructorId" })
    // instructor?: User;

    @ManyToMany(() => User, (user) => user.enrolledCourses)
    @JoinTable({ name: "student_enrolled_courses" })
    students?: User[];

    @ManyToOne(() => Order, (order) => order.courses, { onDelete: "CASCADE" })
    orders?: Order;
}