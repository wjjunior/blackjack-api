import { DeckCard } from "../db/types";
import { CardService } from "./cards.interfaces";

export class CardServiceImpl implements CardService {
  private availableCards: DeckCard[];

  constructor(cards: DeckCard[]) {
    this.availableCards = [...cards];
  }

  getAvailableCards(): DeckCard[] {
    return this.availableCards;
  }

  getRandomCard(): DeckCard {
    const randomIndex = Math.floor(Math.random() * this.availableCards.length);
    const selectedCard = this.availableCards.splice(randomIndex, 1)[0];
    return selectedCard;
  }

  getRandomCardFromDeck(excludedCards: DeckCard[]): DeckCard | undefined {
    const remainingCards = this.availableCards.filter((card) =>
      excludedCards.every(
        (excludedCard) =>
          excludedCard.value !== card.value || excludedCard.suit !== card.suit,
      ),
    );

    if (remainingCards.length === 0) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * remainingCards.length);
    const selectedCard = remainingCards.splice(randomIndex, 1)[0];

    return selectedCard;
  }
}
