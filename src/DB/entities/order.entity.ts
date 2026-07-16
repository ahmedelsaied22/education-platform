import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Course } from "./course.entity";

export const enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    price?: number;

    @Column({ type: 'varchar', length: 50, default: PaymentStatus.PENDING })
    paymentStatus?: PaymentStatus;

    @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    student?: User;

    @ManyToMany(() => Course, (course) => course.orders)
    @JoinTable({ name: "order_items" })
    courses?: Course[];
}