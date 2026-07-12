import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course.entity";
import { Order } from "./order.entity";
import { LessonProgress } from "./lessonProgress.entity";
import { Review } from "./review.entity";
import { Withdrawal } from "./withdrawal.entity";

export const enum UserRole {
    STUDENT = "STUDENT",
    INSTRUCTOR = "INSTRUCTOR",
    ADMIN = "ADMIN"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', length: 100})
    name?: string;

    @Column()
    email?: string;

    @Column()
    password?: string;

    @Column({ default: UserRole.STUDENT })
    role?: UserRole;

    @Column()
    phone?: string;

    @Column()
    address?: string;

    @Column({ type: 'int'})
    age?: number;

    @Column()
    country?: string;

    @Column()
    City?: string;

    @Column()
    emailVerified?: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    emailVerifiedAt?: Date;


    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @ManyToMany(() => Course, (course) => course.students)
    enrolledCourses?: Course[];

    @OneToMany(() => Order, (order) => order.student)
    @JoinColumn({ name: "userId" })
    orders?: Order[];

    @OneToMany(() => LessonProgress, (lessonProgress) => lessonProgress.student)
    lessonProgresses?: LessonProgress[];

    @OneToMany(() => Review, (review) => review.student)
    reviews?: Review[];

    @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.instructor)
    withdrawals?: Withdrawal[];
}