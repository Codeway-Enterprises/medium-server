import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { ApolloServer, gql } from 'apollo-server-koa';
import { createConnection, getConnection, getManager } from 'typeorm';
import routes from './routes';
import { Post } from './entity/Post';

const app = new Koa();

app.use(bodyParser());
app.use(routes.routes()).use(routes.allowedMethods());

const typeDefs = gql`
  type Query {
    medium: String
  }
`;

const resolvers = {
  Query: {
    medium: () => 'Happiness',
  },
};

const apollo = new ApolloServer({ typeDefs, resolvers });
apollo.applyMiddleware({ app });

/**
 * initial tasks except Koa middlewares
 */
async function initialize() {
  try {
    await createConnection();
    const posts = await getManager().createQueryBuilder(Post, 'post').getMany();

    console.log('Postgres connection is established');
  } catch (e) {
    console.log(e);
  }
}

initialize();

export default app;
