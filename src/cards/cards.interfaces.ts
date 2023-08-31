import { DeckCard } from "../db/types";

export interface CardService {
  getAvailableCards(): DeckCard[];
  getRandomCard(): DeckCard;
  getRandomCardFromDeck(excludedCards: DeckCard[]): DeckCard | undefined;
}
