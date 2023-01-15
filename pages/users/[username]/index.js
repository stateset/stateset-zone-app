import { useRouter } from 'next/router'
import UserRecordQL from 'components/users/UserRecordQL';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import OnboardingBar from 'components/OnboardingBar'

export const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
export const WEBSOCKET_ENDPOINT = process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT;

const wsLink = process.browser ? new WebSocketLink({ // if you instantiate in the server, the error will be thrown
  uri: WEBSOCKET_ENDPOINT,
  credentials: 'same-origin',
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET
      }
    }
  }
}) : null;

const httplink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'same-origin',
  headers: {
    'x-hasura-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET
  }
});

const link = process.browser ? split( //only create the split in the browser
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httplink,
) : httplink;

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    addTypename: false
  })
})

const User = () => {
  const router = useRouter()
  const { username } = router.query

  return (
    <>
      <ApolloProvider client={client}>
      <OnboardingBar />
      <UserRecordQL username={username} />
      </ApolloProvider>
    </>
  )
}

export default User