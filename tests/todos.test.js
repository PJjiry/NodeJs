import {db,getTodoById} from "../src/app.js";
import {migrate} from "drizzle-orm/better-sqlite3/migrator"
import test from 'ava'
import {todosTable} from "../src/schema.js";


test.before("run migrations", async (t) => {
    await migrate(db, {
        migrationsFolder: "drizzle"
    })
})

test.after("cleanup", async (t) => {
    await db.delete(todosTable)
})

test('getTodoById test',async (t) => {
    await db.insert(todosTable).values({
        id:10,
        title: "testovaci todo",
        done: false,
        priority:'normal'
    })

    const todo = await getTodoById(10)

    t.is(todo.title, "testovaci todo")
})