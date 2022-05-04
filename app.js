/* eslint-disable no-console */
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

// Middleware
const middleware = require('./Middlewares');

// Controllers
const user = require('./Controller/User');
const gallery = require('./Controller/Gallery');
const post = require('./Controller/Post');
const comment = require('./Controller/Comment');

// Utils
const { errorHandler } = require('./Errors/errorHandler');

const app = express();

app.use('/user', graphqlHTTP({
  schema: user.Schema,
  rootValue: user.Resolver,
  graphiql: true,
}));

app.use('/gallery', middleware.Auth, graphqlHTTP({
  schema: gallery.Schema,
  rootValue: gallery.Resolver,
  graphiql: true,
}));

app.use('/post', middleware.Auth, graphqlHTTP({
  schema: post.Schema,
  rootValue: post.Resolver,
  graphiql: true,
}));

app.use('/comment', middleware.Auth, graphqlHTTP({
  schema: comment.Schema,
  rootValue: comment.Resolver,
  graphiql: true,
}));

app.use(errorHandler);

module.exports = app;
