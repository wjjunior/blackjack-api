import { CardServiceImpl } from "./cards";

const mockDeckCards = [
  { value: "Ace", suit: "Spades" },
  { value: "2", suit: "Hearts" },
  { value: "Ace", suit: "Hearts" },
];

const makeSut = (deckCards = mockDeckCards) => {
  return new CardServiceImpl(deckCards);
};

describe("CardServiceImpl", () => {
  it("should create an instance with available cards", () => {
    const cardService = makeSut();

    expect(cardService).toBeInstanceOf(CardServiceImpl);
    expect(cardService["availableCards"]).toEqual(mockDeckCards);
  });

  it("should get a random card", () => {
    const cardService = makeSut();
    const initialLength = cardService["availableCards"].length;

    const randomCard = cardService.getRandomCard();

    expect(randomCard).toBeDefined();
    expect(cardService["availableCards"]).toHaveLength(initialLength - 1);
  });

  it("should return undefined if no more cards are available", () => {
    const cardService = makeSut([]);

    const randomCard = cardService.getRandomCard();

    expect(randomCard).toBeUndefined();
  });

  it("should return a non excluded card", () => {
    const mockExcludedCards = [
      { value: "Ace", suit: "Hearts" },
      { value: "2", suit: "Hearts" },
    ];
    const cardService = makeSut();
    const randomCard = cardService.getRandomCardFromDeck(mockExcludedCards);

    expect(randomCard).toBeDefined();
    expect(mockExcludedCards).not.toContain(randomCard);
  });

  it("should return undefined when no cards are available", () => {
    const cardService = makeSut([]);
    const randomCard = cardService.getRandomCardFromDeck([]);

    expect(randomCard).toBeUndefined();
  });

  it("should return undefined when all cards are excluded", () => {
    const mockExcludedCards = [...mockDeckCards];
    const cardService = makeSut([]);
    const randomCard = cardService.getRandomCardFromDeck(mockExcludedCards);

    expect(randomCard).toBeUndefined();
  });
});
