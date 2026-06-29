import { pgTable, text, varchar, integer, timestamp, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const formulaTypeEnum = pgEnum('formula_type', ['basic', 'advanced']);
export const occasionEnum = pgEnum('occasion', ['casual', 'formal', 'sporty', 'business', 'evening']);

export const profiles = pgTable('profiles', {
  id: varchar('id').primaryKey(),
  email: varchar('email').unique(),
  name: varchar('name'),
  avatar: varchar('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const formulas = pgTable('formulas', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  description: text('description'),
  type: formulaTypeEnum('type').notNull(),
  occasion: occasionEnum('occasion').notNull(),
  content: jsonb('content').notNull(),
  createdBy: varchar('created_by').references(() => profiles.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const formulaVersions = pgTable('formula_versions', {
  id: varchar('id').primaryKey(),
  formulaId: varchar('formula_id').notNull().references(() => formulas.id),
  version: integer('version').notNull(),
  content: jsonb('content').notNull(),
  changelog: text('changelog'),
  createdBy: varchar('created_by').references(() => profiles.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const savedLooks = pgTable('saved_looks', {
  id: varchar('id').primaryKey(),
  userId: varchar('user_id').references(() => profiles.id),
  occasion: occasionEnum('occasion').notNull(),
  vibes: jsonb('vibes'),
  expression: varchar('expression'),
  outfit: jsonb('outfit').notNull(),
  savedAt: timestamp('saved_at').defaultNow(),
});

export const affiliateLinks = pgTable('affiliate_links', {
  id: varchar('id').primaryKey(),
  productId: varchar('product_id').notNull(),
  platform: varchar('platform').notNull(),
  url: varchar('url').notNull(),
  commission: integer('commission'),
  isActive: boolean('is_active').default(true),
});

export const clickEvents = pgTable('click_events', {
  id: varchar('id').primaryKey(),
  userId: varchar('user_id').references(() => profiles.id),
  affiliateLinkId: varchar('affiliate_link_id').references(() => affiliateLinks.id),
  timestamp: timestamp('timestamp').defaultNow(),
  ipAddress: varchar('ip_address'),
});

export const generationLogs = pgTable('generation_logs', {
  id: varchar('id').primaryKey(),
  userId: varchar('user_id').references(() => profiles.id),
  occasion: occasionEnum('occasion').notNull(),
  vibes: jsonb('vibes'),
  expression: varchar('expression'),
  shoppingIntent: varchar('shopping_intent'),
  requestId: varchar('request_id').unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const failedJobs = pgTable('failed_jobs', {
  id: varchar('id').primaryKey(),
  jobId: varchar('job_id').notNull(),
  jobName: varchar('job_name').notNull(),
  failedAt: timestamp('failed_at').defaultNow(),
  error: text('error').notNull(),
  payload: jsonb('payload'),
});

export type Profile = typeof profiles.$inferSelect;
export type Formula = typeof formulas.$inferSelect;
export type FormulaVersion = typeof formulaVersions.$inferSelect;
export type SavedLook = typeof savedLooks.$inferSelect;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type ClickEvent = typeof clickEvents.$inferSelect;
export type GenerationLog = typeof generationLogs.$inferSelect;
export type FailedJob = typeof failedJobs.$inferSelect;