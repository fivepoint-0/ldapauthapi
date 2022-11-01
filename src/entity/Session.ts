import { Entity, PrimaryGeneratedColumn, Column, ObjectID, ObjectIdColumn, JoinColumn, ManyToOne } from "typeorm"
import { Server } from '../entity/Server'

@Entity()
export class Session {
  @ObjectIdColumn()
  id: ObjectID

  @Column()
  sessionId: string

  @Column()
  server: string

  @Column()
  username: string

  @Column()
  app: string

  @Column()
  created: string

  @Column()
  referer: string

  @Column()
  userAgent: string

  @Column()
  clientIpAddress: string

  @Column()
  failure: boolean
}
