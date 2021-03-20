const { buildSchemaFromTypeDefinitions } = require("apollo-server");

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
  // Encrypt User's password using bcrypt library
  const password = await bcrypt.hash(args.password, 10)
  // Use PrismaClient instance to store the new User record in the database
  const user = await context.prisma.user.create({ data: { ...args, password } })
  // Generate JSON Web Token
  const token = jwt.sign({ userId: user.id }, APP_SECRET)
  // Return AuthPayload shaped object
  return {
    token,
    user,
  }
}

async function post(parent, args, context, info) {
  // Get user ID from JWT set at Authorization header
  const { userId } = context
  // Connect user to link using the user ID
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    }
  })
  context.pubsub.publish("NEW_LINK", newLink)
}