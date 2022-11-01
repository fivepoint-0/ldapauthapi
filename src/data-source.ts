import "reflect-metadata"
import { DataSource } from "typeorm"
import { Server } from "./entity/Server"
import { Session } from "./entity/Session"

export const AppDataSource = new DataSource({
    type: "mongodb",
    port: process.env.MONGO_CONTAINER_PORT as unknown as number,
    name: 'default',
    database: "ldap",
    host: "mongodb",
    useUnifiedTopology: true,
    synchronize: true,
    logging: false,
    entities: [Session, Server],
    migrations: [],
    subscribers: [],
})
