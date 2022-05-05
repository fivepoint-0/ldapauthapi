import * as express from "express"
import { DataSource } from "typeorm"
declare global {
    namespace Express {
        interface Request {
            locals?: {
               [key: string]: any,
               dataSource?: DataSource
            }
        }
    }
}