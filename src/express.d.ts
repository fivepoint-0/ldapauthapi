import { DataSource } from "typeorm";

declare namespace Express {
    export interface Request {
       locals?: {
          [key: string]: any,
          dataSource?: DataSource
       }
    }
 }