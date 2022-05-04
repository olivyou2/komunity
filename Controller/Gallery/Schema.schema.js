const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Gallery {
        id: String!
        name: String!
        owner: String!
    }

    type Id{
        id: String!
    }

    type Query {
        getGallery(id: String!) : Gallery
        getGalleryIds : [Id]
    }

    type Mutation {
        createGallery(name: String!) : Gallery
        removeGallery(id: String!) : Boolean
    }
`);
