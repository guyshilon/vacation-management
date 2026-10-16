import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

export type VacationRequestStatus = "Pending" | "Approved" | "Rejected";

@Entity({ name: "vacation_requests" })
export class VacationRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @ManyToOne(() => User, (user) => user.vacationRequests, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "date" })
  start_date: string;

  @Column({ type: "date" })
  end_date: string;

  @Column({ type: "text", nullable: true })
  reason?: string | null;

  @Column({ type: "varchar", length: 32, default: "Pending" })
  status: VacationRequestStatus;

  @Column({ type: "text", nullable: true })
  comments?: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}
