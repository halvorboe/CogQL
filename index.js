const { ApolloServer, gql } = require('apollo-server');

const { CongiteDataFusion } = require('./datasource');
const { toUniversalIds } = require('./helpers');

require('dotenv').config()

const typeDefs = gql`
  type Asset {
    id: ID
    parent: Asset
    root: Asset
    name: String
  }
  type Event {
    id: ID
    assets: [Asset]
    name: String
  }
  type ThreedModel {
    id: ID
    name: String
  }
  type Query {
    assets: [Asset]
    events: [Event]
    threedModels: [ThreedModel]
  }
`;

const resolvers = {
    Query: {
        assets: async (_source, _args, { dataSources }) => {
            const res = await dataSources.api.getAssets();
            return res.items;
        },
        events: async (_source, _args, { dataSources }) => {
            const res = await dataSources.api.getEvents();
            return res.items;
        },
        threedModels: async (_source, _args, { dataSources }) => {
            const res = await dataSources.api.getThreedModels();
            return res.items;
        }
    },
    Asset: {
        parent: async (_source, _args, { dataSources }) => {
            if (!_source.parentId)
                return undefined;
            const ids = toUniversalIds([_source.parentId]);
            const res = await dataSources.api.getAssetsById(ids);
            return res.items[0];
        },
        root: async (_source, _args, { dataSources }) => {
            return dataSources.api.getAsset(_source.rootId)
        },
    },
    Event: {
        assets: async (_source, _args, { dataSources }) => {
            if (!_source.assetIds) 
                return [];
            const ids = toUniversalIds(_source.assetIds);
            const res = await dataSources.api.getAssetsById(ids);
            return res.items
        }
    }
}

const server = new ApolloServer({
    introspection: true,
    typeDefs,
    resolvers,
    dataSources: () => {
      return {
        api: new CongiteDataFusion(),
      };
    },
    context: () => {
      return {
        apiKey: process.env.API_KEY,
        project: process.env.PROJECT,
      };
    },
  });


  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });