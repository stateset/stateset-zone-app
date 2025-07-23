import '../styles/global.css'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'
import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

// GraphQL endpoint configuration
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql',
})

// Auth link to add headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-hasura-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET,
    }
  }
})

// Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
})

// Public pages that don't require authentication
const publicPages = [
  '/',
  '/sign-in/[[...index]]',
  '/sign-up/[[...index]]',
  '/invoices',
  '/purchaseorders',
  '/loans'
]

export default function MyApp({ Component, pageProps }) {
  const { pathname, push } = useRouter()
  
  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname)

  // Get page title from component or use pathname
  const getPageTitle = () => {
    if (Component.displayName) return Component.displayName
    if (pathname === '/') return 'Welcome'
    if (pathname === '/home') return 'Dashboard'
    return pathname.split('/')[1]?.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'StateSet Zone'
  }

  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => push(to)}
    >
      <ApolloProvider client={client}>
        {isPublicPage ? (
          <Layout title={getPageTitle()}>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <>
            <SignedIn>
              <Layout title={getPageTitle()}>
                <Component {...pageProps} />
              </Layout>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        )}
      </ApolloProvider>
    </ClerkProvider>
  )
}
