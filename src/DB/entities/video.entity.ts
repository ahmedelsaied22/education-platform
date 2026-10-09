import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lesson } from "./lesson.entity";


@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;

    @Column()
    videoId?: string;

    @Column()
    duration?: string;

    @Column()
    description?: string;

    @Column( { enum: ['UPLOADED', 'PROCESSING', 'READY', 'FAILED'], default: 'PROCESSING' } )
    status?: string;

    @ManyToOne(() => Lesson, (lesson) => lesson.video)
    lesson?: Lesson;
}