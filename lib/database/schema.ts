import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  real,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').unique(),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  messages: jsonb('messages').notNull(),
  name: text('name').notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  initialized: boolean('initialized').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const chatSettings = pgTable('chat_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id')
    .references(() => chats.id, { onDelete: 'cascade' })
    .notNull(),
  systemPrompt: text('system_prompt').notNull().default(''),
  temperature: real('temperature').notNull().default(1),
  topP: real('top_p').notNull().default(1),
  topK: integer('top_k').notNull().default(1),
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
