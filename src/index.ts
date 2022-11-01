import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import {config} from 'dotenv'

AppDataSource.initialize().then(async dataSource => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    app.use('*', (req, res, next) => {
        req.locals = {}
        req.locals.dataSource = dataSource
        next()
    })

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    // setup express app here
    // ...

    // start express server
    app.listen(process.env.API_SERVER_PORT)

    console.log(`Express server started on port ${process.env.API_SERVER_PORT}.`)

}).catch(error => console.log(error))
