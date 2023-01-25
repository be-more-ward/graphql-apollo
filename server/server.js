import "dotenv/config.js";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";

import jwt from "jsonwebtoken";
import { User } from "./models/User.js";

import "./db.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const token = auth.split(" ")[1];
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(userId).populate("jobs");
      return { user };
    }
  },
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
