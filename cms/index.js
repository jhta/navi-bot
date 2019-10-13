require("dotenv").config();
const gql = require("graphql-tag");
const ApolloClient = require("apollo-boost").ApolloClient;
const fetch = require("cross-fetch/polyfill").fetch;
const createHttpLink = require("apollo-link-http").createHttpLink;
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
const setContext = require("apollo-link-context").setContext;
const get = require("lodash/get");

const token = process.env.CMS_API_TOKEN;

const httpLink = createHttpLink({
  uri: "https://graphql.datocms.com/",
  fetch: fetch
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: Object.assign(headers || {}, {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    })
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const GET_COMMANDS_QUERY = gql`
  query {
    allCommands {
      id
      title
      response
      subcommand {
        title
        response
      }
    }
  }
`;

const mapCommands = commands =>
  commands.reduce((acc, command) => {
    const { title, response, subcommand = [] } = command;
    const subcommands = subcommand.reduce(
      (sAcc, s) => ({
        ...sAcc,
        [`${title} ${s.title}`]: s.response
      }),
      {}
    );

    return {
      ...acc,
      ...subcommands,
      [title]: response
    };
  }, {});

const getCommandsFromCMS = async () => {
  try {
    const result = await client.query({ query: GET_COMMANDS_QUERY });
    const data = get(result, "data.allCommands", []);
    return mapCommands(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = getCommandsFromCMS;
