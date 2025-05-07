import {sqliteTable, int, text } from "drizzle-orm/sqlite-core";
import {relations} from "drizzle-orm";

export const todosTable = sqliteTable('todos',{
    id: int().primaryKey({autoIncrement: true}),
    title: text().notNull(),
    done: int({mode:'boolean'}).notNull(),
    priority: text().notNull().default('normal'),
    userId: int()
})

export const usersTable = sqliteTable('users',{
    id: int().primaryKey({autoIncrement: true}),
    username: text().notNull().unique(),
    hashedPassword: text().notNull(),
    salt: text().notNull(),
    token: text().notNull(),
})

export const todosRelations= relations(todosTable,
    ({ one}) => ({
        user: one(usersTable)
    })
)

export const usersRelations= relations(usersTable,
    ({ many}) => ({
        todos: many(todosTable)
    })
)