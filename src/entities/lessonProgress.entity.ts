import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Lesson } from "./lesson.entity";

const enum ProgressStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}

@Entity()
export class LessonProgress {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ default: ProgressStatus.NOT_STARTED })
    status?: ProgressStatus;

    @Column()
    watchPercentage?: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    completedAt?: Date;

    @ManyToOne(() => Lesson, (lesson) => lesson.progresses, { onDelete: "CASCADE" })
    @JoinColumn({ name: "lessonId" })
    lesson?: Lesson;

    @ManyToOne(() => User, (user) => user.lessonProgresses, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    student?: User;
}