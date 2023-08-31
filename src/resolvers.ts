import { v4 as uuidv4 } from "uuid";
import { GameRepository } from "./db/db.interfaces";
import { CardService } from "./cards/cards.interfaces";
import { DeckCard } from "./db/types";

const resolvers = (
  gameRepository: GameRepository,
  cardService: CardService,
) => ({
  Mutation: {
    registerGameStart: async () => {
      const dealerCard = cardService.getRandomCard();
      const userCards = [
        cardService.getRandomCard(),
        cardService.getRandomCard(),
      ];

      const gameId = uuidv4();
      const gameData = {
        dealerCards: [dealerCard],
        userCards,
      };

      await gameRepository.insertGame({
        id: gameId,
        gameData: JSON.stringify(gameData),
      });

      return { id: gameId, gameCards: gameData };
    },
    drawCards: async (
      _parent: unknown,
      args: {
        deckId: string;
        numCards: number;
        drawer: string;
      },
    ) => {
      const { deckId, numCards, drawer } = args;

      const gameData = await gameRepository.getGameById(deckId);
      if (!gameData) {
        throw new Error("Game not found");
      }

      const { dealerCards, userCards } = JSON.parse(gameData.gameData);

      const drawnCards: DeckCard[] = Array.from({ length: numCards }, () => {
        const randomCard = cardService.getRandomCardFromDeck([
          ...dealerCards,
          ...userCards,
        ]);
        if (!randomCard) {
          throw new Error("Not enough cards left in the deck");
        }
        return randomCard;
      });

      const updatedDealerCards =
        drawer === "dealer" ? [...dealerCards, ...drawnCards] : dealerCards;
      const updatedUserCards =
        drawer === "user" ? [...userCards, ...drawnCards] : userCards;

      await gameRepository.updateGame(
        deckId,
        JSON.stringify({
          dealerCards: updatedDealerCards,
          userCards: updatedUserCards,
        }),
      );

      return { id: deckId, drawnCards };
    },
  },
});

export default resolvers;
