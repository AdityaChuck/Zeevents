import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import App from "./App";
import useSelectors from "./Util/hooks/selector";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

function ApolloProviderComp() {
  const { token } = useSelectors();

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: "Bearer "+token || null,
      },
    }));
    return forward(operation);
  });

  const client = new ApolloClient({
    link: concat(authMiddleware, httpLink),
    cache: new InMemoryCache(),
    credentials: "include",
    connectToDevTools: true,

  });

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}
export default ApolloProviderComp;
