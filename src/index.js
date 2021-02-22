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
        updateLink: (_, args) => {
            let updatedLink
            links = links.map(link => {
                if (link.id === args.id) {
                    updatedLink = { ...link, ...args }
                    return updatedLink
                }
                return link
            })
            return updatedLink
        },
        deleteLink: (_, {id}) => {
            const removeIndex = links.findIndex(link => link.id === id)
            const removedLink = links[removeIndex]
            links.splice(removeIndex, 1)
            return removedLink
        }
    },
}

// Pass schema and resolvers to an ApolloServer
const prisma = new PrismaClient()

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: {
        prisma,
    }
})

server
    .listen()
    .then(({ url }) =>
    console.log(`Server is running on ${url}`)
    )