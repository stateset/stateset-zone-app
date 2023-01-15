import React from 'react'
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { useRouter } from 'next/router'


const UserRecord = ({ index, user, username }) => {

    return (
<>
            <div class="container max-w-7xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-7 lg:max-w-8xl lg:px-8">
                <div class="flex items-center space-x-5">
                    <div class="flex-shrink-0">
                        <div class="relative mt-8">
                            <img class="h-16 w-16 rounded-full" src={user.avatar} alt="" />
                            <span class="absolute inset-0 shadow-inner rounded-full" aria-hidden="true"></span>
                        </div>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold text-blue-600">{user.firstName} {user.lastName}</h1>
                    </div>
                </div>
            </div>

            <div class="mt-8 max-w-5xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
                <div class="space-y-6 lg:col-start-1 lg:col-span-2">
                    <section aria-labelledby="applicant-information-title">
                        <div class="bg-white shadow sm:rounded-lg">
                            <div class="px-4 py-5 sm:px-6">
                                <h2 id="applicant-information-title" class="text-lg leading-6 font-medium text-blue-600">
                                    User Information
              </h2>
                                <p class="mt-1 max-w-2xl text-base text-gray-500">
                                    Personal details
              </p>
                            </div>
                            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                    <div class="sm:col-span-1">
                                        <dt class="text-base font-medium text-gray-500">
                                            Title
                  </dt>
                                        <dd class="mt-1 text-base text-blue-600">
                                            {user.title}
                                        </dd>
                                    </div>
                                    <div class="sm:col-span-1">
                                        <dt class="text-base font-medium text-gray-500">
                                            Birthday
                  </dt>
                                        <dd class="mt-1 text-base text-blue-600">
                                            {user.birthday}
                                        </dd>
                                    </div>
                                    <div class="sm:col-span-1">
                                        <dt class="text-base font-medium text-gray-500">
                                            Phone
                  </dt>
                                        <dd class="mt-1 text-base text-blue-600">
                                            <a href={"tel:" + user.phone}>{user.phone}</a>
                                        </dd>
                                    </div>
                                    <div class="sm:col-span-1">
                                        <dt class="text-base font-medium text-gray-500">
                                            Email
                  </dt>
                                        <dd class="mt-1 text-base text-blue-600">
                                            <a href={"mailto:" + user.email}>{user.email}</a>
                                        </dd>
                                    </div>
                                    <div class="sm:col-span-1">
                                        <dt class="text-base font-medium text-gray-500">
                                            Twitter
                  </dt>
                                        <dd class="mt-1 text-base text-blue-600">
                                            <a href={"https://twitter.com/" + user.twitter}> @{user.twitter}</a>
                                        </dd>
                                    </div>
                                    <div class="sm:col-span-1">
                                        <dt class="text-base font-medium text-gray-500">
                                            Location
                  </dt>
                                        <dd class="mt-1 text-base text-blue-600">
                                            {user.location}, {user.country}
                                        </dd>
                                    </div>
                                    <div class="sm:col-span-1">
                                        <dt class="text-base font-medium text-gray-500">
                                            Organization
                  </dt>
                                        <dd class="mt-1 text-base text-blue-600">
                                            {user.organization}
                                        </dd>
                                    </div>
                                    <div class="sm:col-span-2">
                                        <dt class="text-base font-medium text-gray-500">
                                            About
                  </dt>
                                        <dd class="mt-1 text-base text-blue-600">
                                            {user.bio}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            </>
        );
    };

export default UserRecord;
