import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	userid: uuid("userid").defaultRandom().primaryKey().notNull(),
	fn: varchar("fn"),
	ln: varchar("ln"),
	email: varchar("email"),
	password: text("password").notNull(),
	username: varchar("username").notNull(),
});

export const chatrooms = pgTable("chatrooms", {
	chatroom_id: uuid("chatroom_id").defaultRandom().primaryKey().notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	chatroom_name: varchar("chatroom_name"),
});

export const chatlogs = pgTable("chatlogs", {
	chatroomId: uuid("chatroom_id").notNull().references(() => chatrooms.chatroom_id),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	message: text("message"),
	userid: uuid("userid").notNull().references(() => users.userid),
});