import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Section } from "./section.entity";
import { LessonProgress } from "./lessonProgress.entity";

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;

    @Column()
    videoUrl?: string;

    @Column()
    pdfUrl?: string;

    @Column()
    duration?: number;

    @ManyToOne(() => Section, (section) => section.lessons, { onDelete: "CASCADE" })
    section?: Section;

    @OneToMany(() => LessonProgress, (progress) => progress.lesson)
    progresses?: LessonProgress[];
}