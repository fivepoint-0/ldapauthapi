import "reflect-metadata"
import { DataSource } from "typeorm"
import { Server } from "./entity/Server"
import { Session } from "./entity/Session"

export const AppDataSource = new DataSource({
    type: "mongodb",
    port: 27017,
    name: 'default',
    database: "test",
    host: "mongodb",
    useUnifiedTopology: true,
    synchronize: true,
    logging: false,
    entities: [Session, Server],
    migrations: [],
    subscribers: [],
})
