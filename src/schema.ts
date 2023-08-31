import { gql } from "apollo-server-express";

export const typeDefs = gql`
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

  type Mutation {
    registerGameStart: Game
  }
`;
