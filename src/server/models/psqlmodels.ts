import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	userid: uuid("userid").defaultRandom().primaryKey().notNull(),
	fn: varchar("fn"),
	ln: varchar("ln"),
	email: varchar("email"),
	password: text("password").notNull(),
	username: varchar("username").notNull(),
	pictureURL: text("pictureURL"),
});

export const chatrooms = pgTable("chatrooms", {
	chatroom_id: uuid("chatroom_id").defaultRandom().primaryKey().notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	chatroom_name: varchar("chatroom_name"),
});

export const chatlogs = pgTable("chatlogs", {
	chatroom_id: uuid("chatroom_id").notNull().references(() => chatrooms.chatroom_id),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	message: text("message"),
	userid: uuid("userid").notNull().references(() => users.userid),
});

export const directmessageroom = pgTable("directmessageroom", {
	user1_id: uuid("user1_id").notNull().references(() => users.userid, { onDelete: "cascade", onUpdate: "cascade" }),
	user2_id: uuid("user2_id").notNull().references(() => users.userid, { onDelete: "cascade", onUpdate: "cascade" }),
	directmessageroom_id: uuid("directmessageroom_id").defaultRandom().primaryKey().notNull(),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	directmessageroom_name: varchar("directmessageroom_name"),
});

export const directmessages = pgTable("directmessages", {
	directmessages_id: uuid("directmessages_id").defaultRandom().primaryKey().notNull(),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	message: text("message").default('').notNull(),
	userid: uuid("userid").notNull().references(() => users.userid, { onDelete: "cascade", onUpdate: "cascade" }),
	directmessageroom_id: uuid("directmessageroom_id").notNull().references(() => directmessageroom.directmessageroom_id, { onDelete: "cascade", onUpdate: "cascade" }),
});