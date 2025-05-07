import {Hono} from "hono";
import {createUser} from "./db.js";
import {renderFile} from "ejs";
import {setCookie} from "hono/dist/types/helper/cookie/index.js";
import {todosTable} from "./schema.js";
import {eq} from "drizzle-orm";

export const usersRouter = new Hono();

usersRouter.get("/register", async (c) => {
    const rendered = await renderFile("views/register.html", {})
    return c.html(rendered)
})

usersRouter.post("/register", async (c) => {
    const form = await c.req.formData()

    const user = await createUser(form.get("username"), form.get("password"))

    setCookie(c.res, "token", user.token)
    return c.redirect("/")
})

usersRouter.get("/mytodos", async (c) => {
    const user = c.get("user")
    const todos = await db.select().from(todosTable).where(eq(todosTable.userId, user.id)).all()

    const index = await renderFile("views/index.html", {
        title: "Todos of " + user.username,
        todos,
        user: c.get("user"),
    })
    return c.html(index)
    }
)
