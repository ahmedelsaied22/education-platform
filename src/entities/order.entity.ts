import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Course } from "./course.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    price?: number;

    @Column()
    paymentStatus?: string;

    @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
    user?: User;

    @OneToMany(() => Course, (course) => course.orders)
    @JoinColumn({ name: "orderId" })
    courses?: Course[];
}