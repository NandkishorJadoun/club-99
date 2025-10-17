#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const SQL = `

CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (255),
    last_name VARCHAR (255),
    email VARCHAR (255),
    password VARCHAR (255),
    is_member BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message TEXT,
    title VARCHAR( 255 ),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DB_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main()