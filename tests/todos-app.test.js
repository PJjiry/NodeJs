import test from 'ava'
import {app} from "../src/app.js"
import {db} from '../src/db.js'
import {testClient} from "hono/testing";
import {migrate} from "drizzle-orm/libsql/migrator";


const client = testClient(app)

test.before(async t => {
    await migrate(db, {migrationsFolder: "drizzle"})
})

test.after(async t => {
    // await db.delete()
})

test.serial('GET returns index with title', async (t) => {
    const response = await client['/'].$get()
    const text = await response.text()

    t.assert(text.includes("<h1>My todo app</h1>"))
})

test.serial('GET returns index with description', async (t) => {

})

test.serial("Post todos creates new todo", async (t) => {

})