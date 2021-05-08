import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { ApolloServer, gql } from 'apollo-server-koa';
import { createConnection, getConnectionOptions } from 'typeorm';
import routes from './routes';

const app = new Koa();

/* setup middlewares */
app.use(bodyParser());
app.use(routes.routes()).use(routes.allowedMethods());

/* integrate GraphQL */
const typeDefs = gql`
  type Query {
    medium: String
  }
`;

const resolvers = {
  Query: {
    medium: () => 'Medium-server',
  },
};

const apollo = new ApolloServer({ typeDefs, resolvers });
apollo.applyMiddleware({ app });

async function initialize() {
  try {
    await createConnection();
    console.log('Postgres connection is established');
  } catch (e) {
    console.log(e);
  }
}

initialize();

export default app;
