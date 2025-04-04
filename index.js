import {Hono} from "hono"
import {serve} from "@hono/node-server"
import {logger} from "hono/logger"
import {serveStatic} from "@hono/node-server/serve-static"
import {renderFile} from "ejs"
import {drizzle} from "drizzle-orm/libsql"
import {todosTable} from "./src/schema.js"
import {eq} from "drizzle-orm"
import {createNodeWebSocket} from "@hono/node-ws";

const db = drizzle({
    connection: "file:db.sqlite",
    logger: true,
})

const app = new Hono()

const {injectWebSocket, upgradeWebSocket} = createNodeWebSocket({app})

app.use(logger())
app.use(serveStatic({root: '/public'}))

app.get('/', async (c) => {
    const todos = await db.select().from(todosTable).all()

    const index = await renderFile("views/index.html", {
        title: "My todo app",
        todos,
    })

    return c.html(index)
})

app.post('/todos', async (c) => {
    const form = await c.req.formData()

    await db.insert(todosTable).values({
        title: form.get("title"),
        done: false,
        priority:'normal'
    })

    sendTodosToAllConnections()

    return c.redirect("/")
})

app.get("/todos/:id", async (c) => {
    const id = Number(c.req.param("id"))

    const todo = await getTodoById(id)

    if (!todo) return c.notFound()

    const detail = await renderFile("views/detail.html", {
        todo,
    })

    sendTodosToAllConnections()

    return c.html(detail)
})

app.post("/todos/:id", async (c) => {
    const id = Number(c.req.param("id"))

    const todo = await getTodoById(id)

    if (!todo) return c.notFound()

    const form = await c.req.formData()

    await db
        .update(todosTable)
        .set({ title: form.get("title"), priority: form.get("priority") })
        .where(eq(todosTable.id, id))

    sendTodosToAllConnections()

    return c.redirect(c.req.header("Referer"))
})

app.get("/todos/:id/toggle", async (c) => {
    const id = Number(c.req.param("id"))

    const todo = await getTodoById(id)

    if (!todo) return c.notFound()

    await db
        .update(todosTable)
        .set({ done: !todo.done })
        .where(eq(todosTable.id, id))

    sendTodosToAllConnections()

    return c.redirect(c.req.header("Referer"))
})

app.get("/todos/:id/remove", async (c) => {
    const id = Number(c.req.param("id"))

    const todo = await getTodoById(id)

    if (!todo) return c.notFound()

    await db.delete(todosTable).where(eq(todosTable.id, id))

    sendTodosToAllConnections()

    return c.redirect("/")
})

// /** @type{Set<WSContext<WebSocket>>} */
const connections = new Set()

app.get('/ws', upgradeWebSocket((c)=>{
    console.log(c.req.path)

    return {
        onOpen:(evt,ws)=>{
            connections.add(ws)
            console.log('Open')
        },
        onClose:(evt, ws)=>{
            connections.delete(ws)
            console.log('Close')
        },
        onMessage:(evt, ws)=>{
            console.log('Message')
        }
    }
}))

const server = serve(app, (info) => {
    console.log(
        `App started on http://localhost:${info.port}`
    )
})
injectWebSocket(server)

const getTodoById = async (id) => {
    return db
        .select()
        .from(todosTable)
        .where(eq(todosTable.id, id))
        .get();
}

const sendTodosToAllConnections = async ()=>{
    const todos = await db.select().from(todosTable).all()
    const rendered = await renderFile("views/_todos.html", {
        todos,
    })
    for (const connection of connections){
        const data = JSON.stringify({type:"todos", html:rendered})
        connection.send(data)
    }
}