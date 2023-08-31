import { DeckCard } from "../db/types";

export interface CardService {
  getRandomCard(): DeckCard;
}
