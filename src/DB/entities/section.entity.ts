import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Course } from "./course.entity";
import { Lesson } from "./lesson.entity";

@Entity()
@Unique(['courseId', 'order'])
export class Section {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;

    @Column()
    description?: string;

    // order of the section in the course
    @Column()
    order?: number;

    @Column()
    courseId?: number;

    @ManyToOne(() => Course, (course) => course.sections, { onDelete: "CASCADE" })
    @JoinColumn({ name: "courseId" })
    course?: Course;

    @OneToMany(() => Lesson, (lesson) => lesson.section)
    lessons?: Lesson[];
}