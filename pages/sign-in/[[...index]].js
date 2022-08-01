import { SignIn } from '@clerk/nextjs'
import OnboardingBar from 'components/OnboardingBar'

const SignInPage = () => (
  <>
  <OnboardingBar />
  <br/>
  <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </>
)

export default SignInPage