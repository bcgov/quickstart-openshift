import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('USER')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;
  @Column()
  email: string;
  @Column({ name: 'phone_number' })
  phoneNumber: string;
  @Column({ name: 'hire_date', type: 'date' })
  hire_date: Date;
  @Column()
  salary: number;
}
