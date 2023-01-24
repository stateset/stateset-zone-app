import { Fragment, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Secp256k1HdWallet } from "@cosmjs/amino";
import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient, defaultRegistryTypes as defaultStargateTypes } from "@cosmjs/stargate";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Search from 'components/search'

var password = '';
if (process.browser) {
    password = localStorage.getItem("mnemonic")
};

export default function OnboardingBar() {

  var height;

  useEffect(() => {
    async function loadWallet(password) {

        if (password) {
            const my_wallet = await DirectSecp256k1HdWallet.fromMnemonic(
                password,
                { prefix: "stateset" },
            );

            const stateset_rpcEndpoint = "https://rpc.stateset.zone";

            const my_client = await SigningStargateClient.connectWithSigner(stateset_rpcEndpoint, my_wallet, { gasPrice: "0.025state" });
            height = await my_client.getHeight();

            console.log("stateset blockchain height: ", height);
        }
    }

    loadWallet();
},

    []);

  return (
    <>
      <Disclosure as="nav" className="flex-shrink-0 dark:bg-slate-900 bg-white">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                {/* Logo section */}
                <div className="flex items-center px-2 lg:px-0 xl:w-64">
                </div>
                <div className="flex-1 flex justify-center lg:justify-end">
                  <div className="w-full px-2 lg:px-6">
                    
                  </div>
                </div>
                <div className="pt-4 pb-3 border-t border-white">
                <div className="px-2 mr-2 space-y-1 z-auto">
                    <UserButton userProfileURL="/user" afterSignOutAll="/" afterSignOutOneUrl="/" />
                </div>
              </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </>
  )
}