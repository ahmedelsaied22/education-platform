import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Section } from "./section.entity";
import { LessonProgress } from "./lessonProgress.entity";
import { Video } from "./video.entity";

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;

    @Column()
    videoUrl?: string;

    // order of the lesson in the section
    @Column()
    order?: number;

    @ManyToOne(() => Section, (section) => section.lessons, { onDelete: "CASCADE" })
    section?: Section;

    @OneToMany(() => LessonProgress, (progress) => progress.lesson)
    progresses?: LessonProgress[];

    @OneToMany(() => Video, (video) => video.lesson)
    video?: Video;
}