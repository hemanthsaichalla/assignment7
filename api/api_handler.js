const fs = require('fs');
require('dotenv').config({ path: 'API.env' });
const { ApolloServer } = require('apollo-server-express');
const product = require('./product.js');

const resolvers = {
  Query: {
    productList: product.list,
    Product: product.get,
    productCounts: product.counts,
  },

  Mutation: {
    productAdd: product.add,
    productUpdate: product.update,
    productRemove: product.remove,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}

module.exports = { installHandler };
