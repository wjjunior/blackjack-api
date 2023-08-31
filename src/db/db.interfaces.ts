import { GameData } from "./types";

export interface GameRepository {
  initDb(): Promise<void>;
  insertGame(gameData: GameData): Promise<void>;
  getGameById(id: string): Promise<GameData | null>;
  updateGame(id: string, gameData: string): Promise<void>;
}
