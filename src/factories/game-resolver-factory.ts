import { CardServiceImpl } from "../cards/cards";
import { SQLiteGameRepository } from "../db/db";
import resolvers from "../resolvers";
import allCards from "../db/deck.json";

export const makeGameResolver = () => {
  const gameRepository = new SQLiteGameRepository();
  const cardService = new CardServiceImpl(allCards.cards);

  return resolvers(gameRepository, cardService);
};
