import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum Drawer {
    dealer
    user
  }

  type Query {
    hello: String # A simple query field
  }

  type Card {
    value: String
    suit: String
  }

  type GameCards {
    dealerCards: [Card]
    userCards: [Card]
  }

  type Game {
    id: ID!
    gameCards: GameCards
  }

  type DrawCardsResponse {
    id: String
    drawnCards: [Card]
  }

  type Mutation {
    registerGameStart: Game
    drawCards(
      deckId: String!
      numCards: Int!
      drawer: Drawer!
    ): DrawCardsResponse
    restartGame(deckId: String!): Game
  }
`;
