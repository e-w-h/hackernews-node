const { ApolloServer } = require('apollo-server')

// Define GraphQL schema 
const typeDefs = `
    type Query {
        info: String!
    }
`

// Implementation of the GraphQL schema
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`
    }
}

// Pass schema and resolvers to an ApolloServer
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server
    .listen()
    .then(({ url }) =>
    console.log(`Server is running on ${url}`)
    )