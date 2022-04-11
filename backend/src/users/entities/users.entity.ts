import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
  @ApiProperty({
    example: "1",
    description: "The ID of the user",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "Peter Green", description: "The name of the user" })
  @Column()
  name: string;

  @ApiProperty({
    example: "abc@gmail.com",
    description: "The email of the user",
  })
  @Column()
  email: string;

  constructor(name?: string, email?: string) {
    this.name = name || "";
    this.email = email || "";
  }
}
