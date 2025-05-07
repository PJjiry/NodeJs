import test from 'ava';
import {createUser, db, getUser, getUserByToken} from "../src/db.js";
import {usersTable} from "../src/schema.js";

test.beforeEach("delete users",async (t) => {
    await db.delete(usersTable)
})

test.serial("create user", async (t) => {
    await createUser("petr", "heslo")

    const users = await db.select().from(usersTable).all()
    t.is(users.length, 1)
})

test.serial("getUserByUsername", async (t) => {
    await createUser("petr", "heslo")
    const user = await getUser("petr")
    t.is(user.username, "petr")
})

test.serial("createUser also return the user", async (t) => {
    const user = await createUser("adam", "heslo")
    t.is(user.username, "adam")
})

test.serial("get user by token", async (t) => {
    const user = await createUser("adam", "heslo")

    const usersByToken = await getUserByToken(user.token)

    t.is(usersByToken.id, user.id)
})