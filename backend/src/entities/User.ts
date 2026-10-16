import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VacationRequest } from "./VacationRequest";

export type UserRole = "Requester" | "Validator";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255, select: false })
  password: string;

  @Column({ type: "varchar", length: 32 })
  role: UserRole;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @OneToMany(() => VacationRequest, (vacationRequest) => vacationRequest.user)
  vacationRequests: VacationRequest[];
}
