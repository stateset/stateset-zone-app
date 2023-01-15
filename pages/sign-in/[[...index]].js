import { SignIn } from '@clerk/nextjs'
import OnboardingBar from 'components/OnboardingBar'

const SignInPage = () => (
  <>
  <OnboardingBar />
  <br/>
  <div class="grid place-content-center align-middle">
  <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </div>
  </>
)

export default SignInPage