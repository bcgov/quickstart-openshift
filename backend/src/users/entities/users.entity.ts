import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("USER")
export class Users {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column({ name: 'company' })
  company: string;

  @Column({ name: 'hire_date', type: 'date' })
  hire_date: Date;

  @Column()
  @ApiProperty()
  salary: number;

}
