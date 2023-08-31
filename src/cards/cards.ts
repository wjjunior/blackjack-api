import { DeckCard } from "../db/types";
import { CardService } from "./cards.interfaces";

export class CardServiceImpl implements CardService {
  private availableCards: DeckCard[];

  constructor(cards: DeckCard[]) {
    this.availableCards = [...cards];
  }

  getRandomCard(): DeckCard {
    const randomIndex = Math.floor(Math.random() * this.availableCards.length);
    const selectedCard = this.availableCards.splice(randomIndex, 1)[0];
    return selectedCard;
  }
}
