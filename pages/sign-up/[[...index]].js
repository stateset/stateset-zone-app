import { SignUp } from '@clerk/nextjs'
import OnboardingBar from 'components/OnboardingBar'

const SignUpPage = () => (
    <>
        <OnboardingBar />
        <br/>
        <div class="grid place-content-center align-middle">
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
        </div>
    </>
)

export default SignUpPage