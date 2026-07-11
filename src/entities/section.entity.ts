import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course.entity";
import { Lesson } from "./lesson.entity";

@Entity()
export class Section {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;

    @Column()
    description?: string;

    @ManyToOne(() => Course, (course) => course.sections, { onDelete: "CASCADE" })
    @JoinColumn({ name: "courseId" })
    course?: Course;

    @OneToMany(() => Lesson, (lesson) => lesson.section)
    lessons?: Lesson[];
}