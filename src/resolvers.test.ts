import resolvers from "./resolvers";
import { GameRepository } from "./db/db.interfaces";
import { CardService } from "./cards/cards.interfaces";

jest.mock("./db/db.interfaces");
jest.mock("./cards/cards.interfaces");
let mockGameRepository: jest.Mocked<GameRepository>;
let mockCardService: jest.Mocked<CardService>;

const makeSut = () => {
  const {
    Mutation: { drawCards, registerGameStart, restartGame },
  } = resolvers(mockGameRepository, mockCardService);
  return { drawCards, registerGameStart, restartGame };
};

describe("registerGameStart Mutation Resolver", () => {
  beforeEach(() => {
    mockGameRepository = {
      getGameById: jest.fn(),
      updateGame: jest.fn(),
      initDb: jest.fn(),
      insertGame: jest.fn(),
    };

    mockCardService = {
      getRandomCardFromDeck: jest.fn(),
      getRandomCard: jest.fn(),
      getAvailableCards: jest.fn(),
    };
  });

  const mockDeckId = "mock-deck-id";
  const mockDealerCard = { value: "Ace", suit: "Spades" };
  const mockUserCard = { value: "2", suit: "Hearts" };

  it("should register a game start correctly", async () => {
    mockCardService.getRandomCard
      .mockReturnValueOnce(mockDealerCard)
      .mockReturnValue(mockUserCard);

    const { registerGameStart } = makeSut();

    const result = await registerGameStart();

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

  it("should draw cards correctly for dealer", async () => {
    mockGameRepository.getGameById.mockResolvedValue({
      id: mockDeckId,
      gameData: JSON.stringify({ dealerCards: [], userCards: [] }),
    });
    mockCardService.getRandomCardFromDeck.mockReturnValue(mockDealerCard);

    const { drawCards } = makeSut();

    const result = await drawCards(null, {
      deckId: mockDeckId,
      numCards: 2,
      drawer: "dealer",
    });

    expect(result.id).toBe(mockDeckId);
    expect(result.drawnCards).toEqual([mockDealerCard, mockDealerCard]);
    expect(mockGameRepository.updateGame).toHaveBeenCalledWith(
      mockDeckId,
      JSON.stringify({
        dealerCards: [mockDealerCard, mockDealerCard],
        userCards: [],
      }),
    );
  });

  it("should draw cards correctly for user", async () => {
    mockGameRepository.getGameById.mockResolvedValue({
      id: mockDeckId,
      gameData: JSON.stringify({ dealerCards: [], userCards: [] }),
    });
    mockCardService.getRandomCardFromDeck.mockReturnValue(mockUserCard);

    const { drawCards } = makeSut();

    const result = await drawCards(null, {
      deckId: mockDeckId,
      numCards: 3,
      drawer: "user",
    });

    expect(result.id).toBe(mockDeckId);
    expect(result.drawnCards).toEqual([
      mockUserCard,
      mockUserCard,
      mockUserCard,
    ]);
    expect(mockGameRepository.updateGame).toHaveBeenCalledWith(
      mockDeckId,
      JSON.stringify({
        dealerCards: [],
        userCards: [mockUserCard, mockUserCard, mockUserCard],
      }),
    );
  });

  it("should throw error when game is not found", async () => {
    mockGameRepository.getGameById.mockResolvedValue(null);

    const { drawCards } = makeSut();

    await expect(
      drawCards(null, {
        deckId: mockDeckId,
        numCards: 1,
        drawer: "user",
      }),
    ).rejects.toThrow("Game not found");
    expect(mockCardService.getRandomCardFromDeck).not.toHaveBeenCalled();
    expect(mockGameRepository.updateGame).not.toHaveBeenCalled();
  });

  it("should throw error when not enough cards left", async () => {
    mockGameRepository.getGameById.mockResolvedValue({
      id: mockDeckId,
      gameData: JSON.stringify({ dealerCards: [], userCards: [] }),
    });
    mockCardService.getRandomCardFromDeck.mockReturnValue(undefined);

    const { drawCards } = makeSut();
    await expect(
      drawCards(null, {
        deckId: mockDeckId,
        numCards: 1,
        drawer: "user",
      }),
    ).rejects.toThrow("Not enough cards left in the deck");
    expect(mockCardService.getRandomCardFromDeck).toHaveBeenCalled();
    expect(mockGameRepository.updateGame).not.toHaveBeenCalled();
  });

  it("should restart the game correctly", async () => {
    const mockGameData = { dealerCards: [], userCards: [] };
    const mockNewDealerCard = { value: "Ace", suit: "Hearts" };
    const mockNewUserCards = [
      { value: "2", suit: "Diamonds" },
      { value: "10", suit: "Clubs" },
    ];
    const expectedNewGameData = {
      dealerCards: [mockNewDealerCard],
      userCards: mockNewUserCards,
    };

    mockGameRepository.getGameById.mockResolvedValue({
      id: mockDeckId,
      gameData: JSON.stringify(mockGameData),
    });
    mockCardService.getRandomCard.mockReturnValueOnce(mockNewDealerCard);
    mockCardService.getRandomCard.mockReturnValueOnce(mockNewUserCards[0]);
    mockCardService.getRandomCard.mockReturnValueOnce(mockNewUserCards[1]);

    const { restartGame } = makeSut();

    const result = await restartGame(null, { deckId: mockDeckId });

    expect(result.id).toBe(mockDeckId);
    expect(result.gameCards).toEqual(expectedNewGameData);
    expect(mockGameRepository.updateGame).toHaveBeenCalledWith(
      mockDeckId,
      JSON.stringify(expectedNewGameData),
    );
  });

  it("should throw error when game is not found", async () => {
    mockGameRepository.getGameById.mockResolvedValue(null);

    const { restartGame } = makeSut();

    await expect(
      restartGame(null, { deckId: "invalid-deck-id" }),
    ).rejects.toThrow("Game not found");
    expect(mockCardService.getRandomCard).not.toHaveBeenCalled();
    expect(mockGameRepository.updateGame).not.toHaveBeenCalled();
  });
});
