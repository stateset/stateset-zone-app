import Head from 'next/head'
import { Fragment, useRef, useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import OnboardingBar from 'components/OnboardingBar'
import { HomeIcon } from '@heroicons/react/solid'
import CreateChannelThreadModal from 'components/chat/CreateChannelThreadModal'
import ChannelWrapper from 'components/chat/ChannelWrapper'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react'
import { ClerkProvider, useUser, SignIn } from "@clerk/clerk-react";

const Channel = () => {

    const router = useRouter();
    const id = router.query;

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [unauthenticated, setUnAuthenticated] = useState(true);
    const [authenticated, setAuthenticated] = useState(true);

    return (
        <>
            <div className="dark:bg-slate-900">
                <Head>
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.2/build/styles/night-owl.min.css"></link>
                    <title>StateGPT Studio</title>
                </Head>
                <OnboardingBar />
                <Transition.Root show={authenticated} as={Fragment}>
                    <div class="mt-8 grid justify-items-center dark:bg-slate-900">
                        <ChannelWrapper channel_id={id} />
                        <CreateChannelThreadModal />
                        <br />
                    </div>
                </Transition.Root>
            </div>
        </>
    )
};

export default Channel