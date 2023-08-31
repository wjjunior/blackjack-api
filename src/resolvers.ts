import { v4 as uuidv4 } from "uuid";
import { GameRepository } from "./db/db.interfaces";
import { CardService } from "./cards/cards.interfaces";

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
  },
});

export default resolvers;
