import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { GameRepository } from "./db.interfaces";
import { GameData } from "./types";

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

  async insertGame(game: GameData): Promise<void> {
    const { id, gameData } = game;
    const db = await this.dbPromise;
    await db.run("INSERT INTO games (id, game_data) VALUES (?, ?)", [
      id,
      gameData,
    ]);
  }
}
