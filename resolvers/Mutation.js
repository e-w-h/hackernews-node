const { buildSchemaFromTypeDefinitions } = require("apollo-server");

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