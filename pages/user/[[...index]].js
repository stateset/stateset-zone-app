import { UserProfile } from '@clerk/nextjs'
import OnboardingBar from 'components/OnboardingBar'

const UserProfilePage = () => 
<>
<OnboardingBar />
<br/>
<br/>
<UserProfile path="/user" routing="path" />
</>

export default UserProfilePage