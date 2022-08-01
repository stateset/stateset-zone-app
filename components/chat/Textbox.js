import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import TypingIndicator from './TypingIndicator';
import { uuid } from "uuidv4";

const insertMessage = gql`
mutation insert_message ($message: message_insert_input! ){
  insert_message (
    objects: [$message]
  ) {
    returning {
      id
      time
      body
      username
    }
  }
}
`;

const emitTypingEvent = gql`
mutation ($username: String) {
  update_users (
    _set: {
      last_typed: "now()"
    }
    where: {
      username: {
        _eq: $username
      }
    }
  ) {
    affected_rows
  }
}
`;


const getChatContext = `gql
query ($last_received_id: String, $last_received_ts: String, $first_received_date: date) {
  message(order_by: {date: desc, timestamp: desc}, where: {_and: {id: {_neq: $last_received_id}, timestamp: {_gte: $last_received_ts}, date: {_gte: $first_received_date}, _and: {user: {username: {_neq: "null"}}}}}, limit: 8) {
    id
    body
    username
  }
}`

var user = '';
var nodeName = '';
if (process.browser) {
  user = localStorage.getItem("username")
  nodeName = localStorage.getItem("client")
};


export default class Textbox extends React.Component {

  constructor(props) {
    super()
    this.state = {
      user: user,
      toUser: "",
      body: "",
      is_question: false,
      chatContext: "",
      msg: "",
      random: 0,
      curTime: "",
      curDate: ""
    }
  }

  // Handle Typing

  handleTyping = (body, mutate) => {
    const textLength = body.length;
    if ((textLength !== 0 && textLength % 5 === 0) || textLength === 1) {
      this.emitTypingEvent(mutate);
    }
    this.setState({ body });
  }

  // Emit Typing


  emitTypingEvent = async (mutate) => {
    if (user) {
      await mutate({
        mutation: emitTypingEvent,
        variables: {
          username: this.state.user
        }
      });
    }
  }

  // Handle Usage Record Creation in Stripe

  handleUsageRecordCreation = async (message) => {
    const createUsage = async () => {

      const res = await fetch('/api/customers/getId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": user
        })
      });

      const stateset_user_data = await res.json();

      console.log(stateset_user_data);

      if (stateset_user_data) {

        const sso_id = stateset_user_data.stateset_customers[0].sso_id;

        fetch('/api/subscriptions/create-usage-record', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "sso_id": sso_id,
            "message_response": message
          })
        });
      }
    };
    createUsage();
  };


  // Handle Chat Response

  handleResponse = async (status, msg, mutate, isCode) => {
    if (status === 200) {
      var min = 1;
      var max = 100;
      var rand = min + (Math.random() * (max - min));
      var uniTime = new Date().toUTCString();
      var orderTime = new Date().toLocaleTimeString();
      var curDate = new Date();
      var isCode = isCode;
      await mutate({
        mutation: insertMessage,
        variables: {
          message: {
            id: uuid(),
            username: 'StatesetAI',
            from: 'StatesetAI',
            body: msg,
            time: orderTime,
            timestamp: uniTime,
            date: curDate,
            isCode: isCode
          }
        }
      });

      // Evaulate the Code
      function evaluate() {
        var frame = document.getElementById('sandbox');
        var code = msg.toString();
        frame.contentWindow.postMessage(eval(code), '*');
        eval(code);
      }

      evaluate();

      this.handleUsageRecordCreation(msg);
    }
  };


  // Send Text

  sendText = async () => {

    const getPhone = async () => {
      const res = await fetch('/api/users/getPhone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": this.state.toUser
        })
      });

      const stateset_user_data = await res.json();

      if (stateset_user_data) {

        const phone_number = stateset_user_data.users[0].phone;

        const res = await fetch('/api/message/sendMessage', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            "to": phone_number,
            "body": this.state.body,
            "user": user,
            "nodeName": nodeName
          }),
        });

        this.setState({
          body: ""
        })
      }
    };

    getPhone();
  };

  // Generate Answer

  generateLongAnswer = async (client) => {
    const res = await fetch('/api/ai/createAnswerLong', {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "question": this.state.body,
      })
    });
    const gpt_answer_text = await res.json()
    this.handleResponse(res.status, gpt_answer_text.answers.toString(), client.mutate, false)

  };

  // Generate Answer

  generateAnswer = async (client) => {
    const res = await fetch('/api/ai/createAnswer', {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "question": this.state.body,
      })
    });
    const gpt_answer_text = await res.json()
    this.handleResponse(res.status, gpt_answer_text.answers.toString(), client.mutate, false)

  };

  // Approvals 

  // Handle Approve

  handleApprove = async (client) => {
    const res = await fetch('/api/network/approve', {
      method: 'POST',
      headers: {
        'token': this.context.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body
      })
    });
    const gpt_text = await res.json();
    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, false);
  };

  handleReject = async (client) => {
    const res = await fetch('/api/network/reject', {
      method: 'POST',
      headers: {
        'token': this.context.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body
      })
    });
    const gpt_text = await res.json();
    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, false);
  };

  // Purchase Order Actions

  // Handle Complete

  handleComplete = async (client) => {
    const res = await fetch('/api/network/complete-purchase-order', {
      method: 'POST',
      headers: {
        'token': this.context.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body
      })
    });
    const gpt_text = await res.json();
    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, false);
  };

  // Handle Cancel

  handleCancel = async (client) => {
    const res = await fetch('/api/network/cancel-purchase-order', {
      method: 'POST',
      headers: {
        'token': this.context.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body
      })
    });
    const gpt_text = await res.json();
    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, false);
  };

    // Handle Cancel

    handleFinance = async (client) => {
      const res = await fetch('/api/network/finance-purchase-order', {
        method: 'POST',
        headers: {
          'token': this.context.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "body": this.state.body
        })
      });
      const gpt_text = await res.json();
      this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, false);
    };

  // Handle Close Case

  handleClose = async (client) => {
    const res = await fetch('/api/network/close-case', {
      method: 'POST',
      headers: {
        'token': this.context.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body
      })
    });
    const gpt_text = await res.json();
    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, false);
  };


  // Handle Chat

  handleChat = async (client) => {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'token': this.context.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body
      })
    });
    const gpt_text = await res.json();
    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, false);
  };

  // Handle Code

  handleCode = async (client) => {
    const res = await fetch('/api/ai/assertCode', {
      method: 'POST',
      headers: {
        'token': this.context.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body
      })
    });
    const gpt_text = await res.json();

    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, true)
  };

  // Handle Enter to Submit in Text Area

  handleUserKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      this.form.onSubmit();
    }
  };

  render() {

    var min = 1;
    var max = 100;
    var rand = min + (Math.random() * (max - min));
    var uniTime = new Date().toUTCString();
    var orderTime = new Date().toLocaleTimeString();
    var curDate = new Date();

    return (
      <Mutation
        mutation={insertMessage}
        variables={{
          message: {
            id: rand.toString(),
            username: user,
            from: this.state.user,
            body: this.state.body,
            time: orderTime,
            timestamp: uniTime,
            date: curDate
          }
        }}
        update={(cache, { data: { insert_message } }) => {
          this.props.mutationCallback(
            {
              id: insert_message.returning[0].id,
              times: insert_message.returning[0].time,
              username: insert_message.returning[0].username,
              body: insert_message.returning[0].body,
            }
          );
        }}
      >
        {
          (insert_message, { data, loading, error, client }) => {
            const sendMessage = (e) => {
              e.preventDefault();
              if (this.state.body.includes('@StatesetAI', 'StatesetAI', 'StatesetAi', 'statesetai')) {
                insert_message();
                this.handleChat(client);
                this.setState({
                  body: ""
                });
              } else if (this.state.body.includes('@')) {
                insert_message();
                var body_string = this.state.body;
                var name_string = body_string.substring(body_string.indexOf('@') + 1, 9);
                this.setState({
                  toUser: name_string,
                })
                this.sendText();
              } else if (this.state.body.includes('/code')) {
                insert_message();
                this.handleCode(client);
                this.setState({
                  body: ""
                });
              } else if (this.state.body.includes('/answer')) {
                insert_message();
                this.generateAnswer(client);
                this.setState({
                  body: ""
                });
              } else if (this.state.body.includes('/longAnswer')) {
                insert_message();
                this.generateLongAnswer(client);
                this.setState({
                  body: ""
                });
              } else {
                insert_message();
                this.setState({
                  body: ""
                });
              }
            }
            return this.form(sendMessage, client);
          }
        }

      </Mutation>
    )
  }

  form = (sendMessage, client) => {
    return (
      <form onSubmit={sendMessage}>
        <br />
        <br />
        <TypingIndicator username={this.state.user} />
        <div className="inline-flex items-center justify-between">
          <textarea
            id="textbox"
            className="m-2 py-2 px-8 w-64 mr-2 ml-4 rounded-full border border-gray-300 bg-gray-100 resize-none"
            placeholder="Type a Message..."
            value={this.state.body}
            rows="1"
            autoFocus={true}
            onChange={(e) => {
              this.handleTyping(e.target.value, client.mutate);
            }}
          />
        </div>
        <button type="button" type="submit" className="inline-flex items-center px-4 py-2 mt-4 ml-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Send
        </button>
        <br />
        <span className="ml-12 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          <svg className="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
            <circle cx={4} cy={4} r={3} />
          </svg>
        @StatesetAI
      </span>
        <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          <svg className="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
            <circle cx={4} cy={4} r={3} />
          </svg>
        /code
      </span>
        <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          <svg className="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
            <circle cx={4} cy={4} r={3} />
          </svg>
        /answer
      </span>
      </form>
    );
  }
}