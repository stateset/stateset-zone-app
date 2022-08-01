import { SignUp } from '@clerk/nextjs'
import OnboardingBar from 'components/OnboardingBar'

const SignUpPage = () => (
    <>
        <OnboardingBar />
        <br/>
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </>
)

export default SignUpPage