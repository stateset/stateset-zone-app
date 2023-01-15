import React, { useEffect, useState, useContext } from "react";
import Link from 'next/link'
import hljs from 'highlight.js';

const Message = ({ message, user }) => {

    var timestamp = message.timestamp;
    var time = timestamp.substring(0, 12);

    useEffect(() => {
        hljs.initHighlighting();
    }, [message.timestamp]);

    // Check User
    let user_check = function (message) {
        if (message.from == "StateGPT" && message.isCode == true) {
            return <div class="flex flex-wrap"><pre class="p-4 text-xs text-white dark:bg-slate-900 bg-black rounded-lg"><code>{message.body}</code></pre><br /></div>
        } else {
            return <div class="flex flex-wrap dark:text-white"><><div>{message.body}</div><br /></></div>
        }
    };

    return (

        <div class="flow-root dark:bg-slate-900">
            <ul role="list" class="-mb-8 dark:bg-slate-900">
                <li>
                    <div class="relative pb-8 dark:bg-slate-900">
                        <span class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        <div class="relative flex items-start space-x-3">
                            <div class="relative">
                                <img class="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 dark:ring-slate-900 ring-white" src={user.avatar} alt="" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <div>
                                    <div class="text-base">
                                        <Link href='/users/[username]' as={`/users/${user.username}`}><a class="font-medium dark:text-white text-blue-600">{message.from}</a></Link>
                                    </div>
                                    <p class="mt-0.5 text-base text-gray-500">
                                        {time} 
                                    </p>
                                </div>
                                <div class="flex flex-wrap max-w-80 mt-1 mb-2 text-base dark:text-white text-gray-700">
                                    {user_check(message)}
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Message;
