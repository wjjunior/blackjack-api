export interface GameRepository {
  initDb(): Promise<void>;
  insertGame(gameData: string): Promise<void>;
}
