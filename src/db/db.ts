import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { GameRepository } from "./db.interfaces";

export class SQLiteGameRepository implements GameRepository {
  private dbPromise: Promise<Database>;

  constructor() {
    this.dbPromise = open({
      filename: "./src/db/sqlite.db",
      driver: sqlite3.Database,
    });
  }

  async initDb(): Promise<void> {
    const db = await this.dbPromise;

    await db.exec(`
        CREATE TABLE IF NOT EXISTS games (
          id TEXT PRIMARY KEY,
          game_data TEXT
        );
      `);
  }

  async insertGame(gameData: string): Promise<void> {
    const db = await this.dbPromise;
    await db.run("INSERT INTO games (game_data) VALUES (?)", gameData);
  }
}
