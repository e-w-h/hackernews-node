const { ApolloServer, AddArgumentsAsVariables } = require('apollo-server')
const fs = require('fs')
const path = require('path')

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

// Implementation of the GraphQL schema
let idCount = links.length
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (_, {id}) => {
            const link = links.find(link => link.id === id)
            return link
        } 
    },
    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            }
            links.push(link)
            return link
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
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
})

server
    .listen()
    .then(({ url }) =>
    console.log(`Server is running on ${url}`)
    )