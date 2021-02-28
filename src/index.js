const { ApolloServer, AddArgumentsAsVariables } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

// Implementation of the GraphQL schema
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => async (parent, args, context) => {
            return context.prisma.link.findMany()
        },
        link: () => async (parent, args, context) => {
            const link = context.prisma.link.findUnique({
                where: {
                    id: args.id,
                }
            })
            return link
        } 
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            })
            return newLink
        },
        updateLink: (parent, args, context, info) => {
            const updatedLink = context.prisma.link.update({
                where: {
                    id: args.id,
                },
                data: {
                    url: args.url,
                    description: args.description,
                }
            })
            return updatedLink
        },
        deleteLink: (parent, args, context, info) => {
            const deletedLink = context.prisma.link.delete({
                where: {
                    id: args.id,
                },
            })
            return deletedLink
        }
    },
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
    context: {
        prisma,  // Attach instance of PrismaClient to the context 
    }
})

server
    .listen()
    .then(({ url }) =>
    console.log(`Server is running on ${url}`)
    )