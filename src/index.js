const { ApolloServer, AddArgumentsAsVariables } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const { getUserId } = require('./utils')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const { PubSub } = require('apollo-server')
const Subscription = require('./resolvers/Subscription')

const pubsub = new PubSub()

// Implementation of the GraphQL schema
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link
}

// Pass schema and resolvers to an ApolloServer
const prisma = new PrismaClient()

// Initialize GraphQL server
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    // Create the context as a function which returns the context
    context: ({ req }) => {
        return {
          ...req,  // Attach HTTP request that carries the incoming query/mutation
          prisma,  // Attach instance of PrismaClient to the context 
          pubsub,
          userId:
            // Read Authorization header and validate if possible
            req && req.headers.authorization ? getUserId(req) : null
        }
    }
})

server
    .listen()
    .then(({ url }) =>
    console.log(`Server is running on ${url}`)
    )