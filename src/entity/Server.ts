import { Entity, PrimaryGeneratedColumn, Column, ObjectIdColumn, ObjectID } from "typeorm"

@Entity()
export class Server {
  @ObjectIdColumn()
  id: ObjectID

  @Column({ default: '' })
  host: string

  @Column({ default: '389' })
  port: string

  @Column({ default: '' })
  domain: string

  @Column({ default: 'dc=example,dc=com' })
  baseDN: string

  @Column({ default: 28800 })
  cookieTimer: number

  @Column({ default: 3 })
  lockoutCount: number

  @Column({ default: false })
  active: boolean
}
