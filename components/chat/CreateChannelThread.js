import React from "react"
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import { uuid } from "uuidv4";
import Router from "next/router"

class CreateChannelThread extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
        }
    }

    idRef = React.createRef();
    nameRef = React.createRef();


    createChannelThread = event => {
        event.preventDefault();
        const channel_thread = {
            id: this.idRef.current.value,
            name: this.nameRef.current.value
        };

        this.state = {
            message: ''
        }

        this.props.client
            .mutate({
                mutation: gql`
               mutation addChannelThread($channel_thread: channel_thread_insert_input!) {
                insert_channel_thread(objects: [$channel_thread]) {
                  returning {
                      id
                      name

                }
              }
              }`,
                variables: { channel_thread }
            })

            .then(res => {
                console.log(res)
                this.setState({
                    message: 'Channel Thread Created.',
                })
                Router.push(`/s/${res.data.insert_channel_thread.returning[0].id}`)
            })

            .catch(err => {
                console.log(err);
            });


        event.currentTarget.reset();
    };


    render() {
        return (
            <form onSubmit={this.createChannelThread}>
                <div>
                    <h3 class="text-lg leading-6 font-medium text-blue-600">New StateGPT Studio</h3>
                </div>
                <div class="sm:rounded-md sm:overflow-hidden">
                    <div class="bg-white py-6 px-4 space-y-6 sm:p-6">
                        <input type="number" name="id" id="id" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base" ref={this.idRef} placeholder="Id" />
                        <input type="text" name="name" id="name" autocomplete="given-name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base" ref={this.nameRef} placeholder="Name" />
                    </div>
                </div>
                <button className="float-right mb-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 sm:ml-3 sm:w-auto sm:text-base" type="submit">Create Studio</button>
            </form>
        );
    }
}

export default withApollo(CreateChannelThread);