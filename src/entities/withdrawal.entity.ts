import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export const enum WithdrawalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

@Entity()
export class Withdrawal {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'float'})
    amount?: number;

    @Column({ default: WithdrawalStatus.PENDING })
    status?: WithdrawalStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @ManyToOne(() => User, (user) => user.withdrawals, { onDelete: "CASCADE" })
    instructor?: User;
}