import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  userid: varchar('userid', { length: 20 }).primaryKey(),
  username: varchar('username', { length: 20 }),
  fn: varchar('fn', { length: 20 }),
  ln: varchar('ln', { length: 20 }),
  email: varchar('email', { length: 20 }),
  password: text('password'),

});

// other postgres tables...