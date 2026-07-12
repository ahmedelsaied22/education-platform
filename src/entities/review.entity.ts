import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Course } from "./course.entity";

@Entity()
@Index(["student", "course"], { unique: true })
export class Review {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    rating?: number;

    @Column()
    comment?: string;

    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn({ name: "studentId" })
    student?: User;

    @ManyToOne(() => Course, (course) => course.reviews)
    @JoinColumn({ name: "courseId" })
    course?: Course;
}