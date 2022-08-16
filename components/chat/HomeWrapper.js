import React, { Component, Fragment } from "react";
import gql from "graphql-tag";
import { withApollo, Subscription } from 'react-apollo';
import Message from "./Message";
import HomeTextbox from './HomeTextbox'
import { motion } from 'framer-motion';
import { withUser } from "@clerk/clerk-react";

let easing = [0.175, 0.85, 0.42, 0.96];

const textVariants = {
  exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.1, duration: 0.5, ease: easing }
  }
};


class HomeWrapper extends Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    // this.scrollRef = React.createRef();
    // this.newMessages = data.messages;
  }

  componentDidMount() {
    // this.scrollToBottom()
    document.addEventListener('DOMContentLoaded', (event) => {
      console.log('Welcome to Stateset Code. This is the future of software.');
    });

    document.addEventListener("DOMContentLoaded", function () {
      window.addEventListener("message", (event) => {
        window.eval(event.data);
      });
    });
  };


  scrollToBottom = () => {
    this.scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    return (
      <div className="messageWrapper">
        <Subscription subscription={gql`
subscription ($last_received_id: String, $last_received_ts: String, $first_received_date: date) {
  message(order_by: {date: desc, timestamp: desc}, where: {_and: {id: {_neq: $last_received_id}, timestamp: {_gte: $last_received_ts}, date: {_gte: $first_received_date}, _and: {user: {username: {_neq: "null"}}, channel_id: {_is_null: true}}}}, limit: 8) {
    id
    body
    username
    from
    time
    timestamp
    date
    created_at
    isCode
    likes
    return_id
    warranty_id
    user {
      id
      username
      avatar
    }
  }
}
`}>
          {({ loading, error, data }) => {
            if (loading) {
              return (<div>
              </div>);
            }
            if (error) {
              console.error(error);
              return (<span> Error Fetching Message Subscription!</span>);
            }
            if (data) {

              const messages = data.message;

              const messagesList = [];
              messages.forEach((message, index) => {
                messagesList.push(
                  <Message
                    key={index}
                    index={index}
                    message={message}
                    user={message.user}
                  />);
              });
              return (
                <>
                  <div className="dark:bg-slate-900">
                    <motion.div initial="exit" animate="enter" exit="exit">
                      <motion.div variants={textVariants}>
                        <HomeTextbox username={this.props.user.username} user_id={this.props.user.id} />
                        <Fragment>
                          {messagesList}
                        </Fragment>
                      </motion.div>
                    </motion.div>
                    <iframe title="generated" id="sandbox" class="iframe" width="0.1%" height="0.1%" frameborder="none" sandbox="allow-scripts">
                    </iframe>
                  </div>
                </>
              );
            }
          }}
        </Subscription>
        <style jsx>{`
    

    .chatDialog {
      border-radius: 10px;
      background: rgba(0,0,0,0.1);
      background-color: white;
      height: 1000px;
      width: 550px;
      margin-left: 8px;
      overflow-y: hidden;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar-track {
      border-radius: 10px;
      background: rgba(0,0,0,0.1);
      border: 1px solid #ccc;
    }
    
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: linear-gradient(left, #fff, #e4e4e4);
      border: 1px solid #aaa;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #fff;
    }
    
    ::-webkit-scrollbar-thumb:active {
      background: linear-gradient(left, #22ADD4, #1E98BA);
    }

    ::-webkit-scrollbar {
      width: 12px;
    }


    .conversationNameContainer: {
      backgroundColor: '#fafafa',
      padding: 20,
      borderBottom: '1px solid #ddd'
    }

    .conversationName: {
      margin: 0,
      fontSize: 16,
      fontWeight: 500
    }

    .scroller: {
      float:"left", clear: "both"
    }

    .messagesContainer: {
      height: 'calc(100vh - 219px)',
      overflow: 'scroll',   
    }

    .message: {
      backgroundColor: "#ededed",
      borderRadius: 10,
      margin: 10,
      padding: 20
    }

    .messageText: {
      margin: 0
    }

    .input: {
      height: 45,
      outline: 'none',
      border: '2px solid #ededed',
      margin: 5,
      borderRadius: 30,
      padding: '0px 20px',
      fontSize: 18,
      width: 'calc(100% - 54px)'
    }

    .inputContainer: {
      width: '100%',
      position: 'absolute',
      bottom: 50,
      left: 0,
    }
    
    `}</style>
      </div>
    );
  }
}

export default withApollo(withUser(HomeWrapper));