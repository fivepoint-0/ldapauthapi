import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm"

@Entity()
export class SetCookieEndpoint {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  url: string

  @Column()
  active: boolean
}
