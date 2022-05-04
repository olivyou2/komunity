const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        id: String!
        title: String!
        contents: String!
        author: String!
        gallery: String!
    }

    type Id {
        id: String!
    }

    type Query {
        getPost(postId: String!): Post
        getPostIds(galleryId: String!): [Id!]!
    }

    input createPostInput {
        title: String!
        contents: String!
    }

    input updatePostInput {
        title: String
        contents: String
    }

    type Mutation {
        createPost(input: createPostInput!, galleryId: String!) : Post
        removePost(id: String!) : Boolean
        updatePost(input: updatePostInput!, postId: String!) : Boolean
    }
`);
