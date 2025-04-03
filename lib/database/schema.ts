import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  messages: jsonb('messages').notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp('expires_at')
    .notNull()
    .$defaultFn(() => {
      return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
