const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        id: String!
        name: String!
    }

    type GetUserOutput {
        user: User!
        accessToken: String!
        refreshToken: String!
    }

    type AccessTokenOutput {
        accessToken: String!
        refreshToken: String!
    }

    input UserInput {
        name: String!
        password: String!
    }

    input TokenInput {
        refreshToken: String!
    }

    type Query {
        getUser(input: UserInput!) : GetUserOutput
    }

    type Mutation {
        createUser(input: UserInput!) : User
        removeUser(input: UserInput!) : Boolean
        refreshToken(input: TokenInput!) : AccessTokenOutput
    }
`);
