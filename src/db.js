import {drizzle} from "drizzle-orm/libsql"
import crypto from "crypto"
import {eq} from "drizzle-orm"
import {todosTable, usersTable} from "./schema.js"
import {title} from "hono/dist/types/jsx/intrinsic-element/components.js";

export const db = drizzle({
    connection:
        process.env.NODE_ENV === "test"
            ? "file::memory:"
            : "file:db.sqlite",
    logger: process.env.NODE_ENV !== "test",
})

export const getAllTodos = async () => {
    const todos = await db.select().from(todosTable).all()

    return todos
}

export const getTodoById = async (id) => {
    const todo = await db
        .select()
        .from(todosTable)
        .where(eq(todosTable.id, id))
        .get()

    return todo
}

export const createTodo = async (values) => {
    return await db
        .insert(todosTable)
        .values({
                ...values,
                userId: values.user ? values.user.id : null,
            }
        )
        .returning(todosTable)
        .get()
}

export const updateTodo = async (id, values) => {
    await db
        .update(todosTable)
        .set(values)
        .where(eq(todosTable.id, id))
}

export const deleteTodo = async (id) => {
    await db.delete(todosTable).where(eq(todosTable.id, id))
}

export const createUser = async (username, password) => {
    const salt = crypto.randomBytes(16).toString('hex')
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
    const token = crypto.randomBytes(16).toString('hex')

    return await db.insert(usersTable).values({
        username,
        hashedPassword,
        token,
        salt
    }).returning(usersTable).get()
}

export const getUser = async (username, password) => {
    const user = await db.select().from(usersTable).where(eq(usersTable.username, username)).get()
    if (!user) return null
    const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 100000, 64, 'sha512').toString('hex')
    if (user.hashedPassword !== hashedPassword) return null
    return user
}

export const getUserByToken = async (token) => {
    const user = await db.select().from(usersTable).where(eq(usersTable.token, token)).get()
    return user
}