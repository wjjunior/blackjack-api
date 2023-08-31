import { CardServiceImpl } from "./cards"; // Import the correct path

const mockDeckCards = [
  { value: "Ace", suit: "Spades" },
  { value: "2", suit: "Hearts" },
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
});
