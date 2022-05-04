const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Comment {
        id: String!
        author: String!
        contents: String!
        parent: String!
    }

    type Id{
        id: String!
    }

    type Query {
        getComment(commentId: String!) : Comment
        getCommentIds(parent: String!) : [Id]
    }

    input createCommentInput {
        contents: String!
        parent: String!
        galleryId: String!
    }

    type Mutation {
        createComment(input: createCommentInput!) : Comment
        removeComment(commentId: String!) : Boolean
    }
`);
