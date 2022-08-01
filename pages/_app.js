import '../styles/global.css'

import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { useRouter } from 'next/router';

const publicPages = ['/', '/sign-in/[[...index]]', '/sign-up/[[...index]]', '/commerce', '/contracts', '/purchaseorders', '/vote'];


function MyApp({ Component, pageProps }) {


  const { pathname, push } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  return (

    <ClerkProvider 
    frontendApi=""
    navigate={(to) => push(to)} >
            {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <>
        <SignedIn>
          <Component {...pageProps} />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
      )}
    </ClerkProvider>

  );
}

export default MyApp
