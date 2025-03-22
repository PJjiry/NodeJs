import {Hono} from 'hono'
import {serve} from "@hono/node-server";
import {logger} from "hono/logger";
import {serveStatic} from "@hono/node-server/serve-static";
import {renderFile} from "ejs";

const todos = [
    {
        id: 1,
        title: 'Zajit na pivo',
        done: false,
    },
    {
        id: 2,
        title: 'Udelat semestralku',
        done: false,
    }
]

const app = new Hono()

app.use(logger())
app.use(serveStatic({root: '/public'}))

app.get("/", async (c) => {
    const html = await renderFile("views/index.html", {
        title: "My todo app",
        todos,
    })
    return c.html(html)
})

app.post('/todos', async (c) => {
    const form = await c.req.formData()

    todos.push({
        id: todos.length + 1,
        title: form.get('title'),
        done: false,
    })
    return c.redirect('/')
})


app.get('/todos/:id/toggle', async (c) => {
    const id = Number(c.req.param('id'))

    const todo = todos.find((todo => todo.id === id))

    if (!todo) {
        return c.notFound()
    }
    todo.done = !todo.done
    return c.redirect('/')
})

app.get('/todos/:id/remove', async (c) => {
    const id = Number(c.req.param('id'))

    const index = todos.findIndex((todo) => todo.id === id)
    todos.splice(index, 1)
    return c.redirect('/')
})

app.get('/todo/:id', async (c) => {
    const id = Number(c.req.param('id'))

    const todo = todos.find((todo => todo.id === id))

    if (!todo) {
        return c.notFound()
    }
    const html = await renderFile("views/todo.html", {
        todo,
    })

    return c.html(html)
})

app.post('/todo/:id/change', async (c) => {
    const id = Number(c.req.param('id'))

    const index = todos.findIndex((todo) => todo.id === id)
    const form = await c.req.formData()

    todos[index].title = form.get('title')
    return c.redirect('/')
})

serve(app, (error, server) => {

})