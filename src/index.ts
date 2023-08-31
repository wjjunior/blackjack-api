import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema";
import { SQLiteGameRepository } from "./db/db";
import { makeGameResolver } from "./factories/game-resolver-factory";

const app = express();

const gameRepository = new SQLiteGameRepository();

const server = new ApolloServer({
  typeDefs,
  resolvers: makeGameResolver(),
});

async function startServer() {
  await gameRepository.initDb();
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
