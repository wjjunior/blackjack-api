import { GameData } from "./types";

export interface GameRepository {
  initDb(): Promise<void>;
  insertGame(gameData: GameData): Promise<void>;
}
