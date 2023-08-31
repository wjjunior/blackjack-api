import resolvers from "./resolvers";
import { GameRepository } from "./db/db.interfaces";
import { CardService } from "./cards/cards.interfaces";

jest.mock("./db/db.interfaces");
jest.mock("./cards/cards.interfaces");

describe("registerGameStart Mutation Resolver", () => {
  const mockGameRepository: GameRepository = {
    initDb: jest.fn(),
    insertGame: jest.fn(),
  };

  const mockCardService: CardService = {
    getRandomCard: jest.fn(),
  };

  const mockDealerCard = { value: "Ace", suit: "Spades" };
  const mockUserCard = { value: "2", suit: "Hearts" };

  const mockCardServiceGetRandomCard =
    mockCardService.getRandomCard as jest.Mock;
  mockCardServiceGetRandomCard
    .mockReturnValueOnce(mockDealerCard)
    .mockReturnValue(mockUserCard);

  it("should register a game start correctly", async () => {
    const resolvedResolvers = resolvers(mockGameRepository, mockCardService);

    const result = await resolvedResolvers.Mutation.registerGameStart();

    expect(result).toEqual({
      id: expect.any(String),
      gameCards: {
        dealerCards: [mockDealerCard],
        userCards: [mockUserCard, mockUserCard],
      },
    });

    expect(mockGameRepository.insertGame).toHaveBeenCalledWith({
      id: expect.any(String),
      gameData: JSON.stringify(result.gameCards),
    });
    expect(mockCardService.getRandomCard).toHaveBeenCalledTimes(3);
  });
});
