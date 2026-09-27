const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Step {
    id: Int!
    name: String!
    completed: Boolean!
  }

  type Release {
    id: ID!
    name: String!
    date: String!
    status: String!
    additionalInfo: String
    steps: [Step!]!
  }

  type Query {
    releases: [Release!]!
    release(id: ID!): Release
  }

  type Mutation {
    createRelease(
      name: String!
      date: String!
      additionalInfo: String
    ): Release!

    updateRelease(
      id: ID!
      additionalInfo: String
    ): Release!

    toggleStep(
      id: ID!
      stepId: Int!
      completed: Boolean!
    ): Release!

    deleteRelease(id: ID!): Boolean!
  }
`);

module.exports = schema;