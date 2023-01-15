import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import TypingIndicator from './TypingIndicator';
import { uuid } from "uuidv4";
import { withUser } from "@clerk/clerk-react";

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


export default class HomeTextbox extends React.Component {

  constructor(props) {
    super()
    this.state = {
      user: props.username,
      user_id: props.user_id,
      toUser: "",
      body: "",
      is_question: false,
      chatContext: "",
      msg: "",
      random: 0,
      curTime: "",
      curDate: ""
    }
  };


  handleQuickCommand = (command) => {

    this.setState({
      body: command
    })
  };

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
    if (this.state.user) {
      await mutate({
        mutation: emitTypingEvent,
        variables: {
          username: this.state.user
        }
      });
    }
  }



  // Handle Typing

  handleAITyping = (mutate) => {

    this.emitAITypingEvent(mutate);

  }

  // Emit Typing


  emitAITypingEvent = async (mutate) => {
    if (this.state.user) {
      await mutate({
        mutation: emitTypingEvent,
        variables: {
          username: 'StateGPT'
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
          "user_id": this.state.user_id
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

  // Generate Edit

  generateEdit = async (client) => {
    const res = await fetch('/api/ai/edit', {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body,
      })
    });
    const gpt_text = await res.json()
    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, false)

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
            username: 'StateGPT',
            from: 'StateGPT',
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

    this.handleAITyping(client.mutate);
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

    this.handleAITyping(client.mutate);
    const gpt_answer_text = await res.json()
    this.handleResponse(res.status, gpt_answer_text.answers.toString(), client.mutate, false)

  };


  // Generate Edit

  generateEdit = async (client) => {
    const res = await fetch('/api/ai/edit', {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body,
      })
    });

    this.handleAITyping(client.mutate);

    const gpt_text = await res.json()
    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, false)

  };

  // Generate Edit

  generateTranslation = async (client) => {
    const res = await fetch('/api/ai/translate', {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body,
      })
    });
    const gpt_text = await res.json()
    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, false)

  };


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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body
      })
    });

    this.handleAITyping(client.mutate);
    const _delay = ms => new Promise(res => setTimeout(res, ms));
    await _delay(2000);
    const gpt_text = await res.json();
    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, false);
  };


  // Handle Chat

  handleStreamChat = async (client) => {

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": this.state.body
      })
    });

    const data = res.body;

    const reader = data.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let tempState = '';

    while (!done) {
      // eslint-disable-next-line no-await-in-loop
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const newValue = decoder
        .decode(value)
        .replaceAll('data: ', '')
        .split('\n\n')
        .filter(Boolean);

      if (tempState) {
        newValue[0] = tempState + newValue[0];
        tempState = '';
      }

      // eslint-disable-next-line @typescript-eslint/no-loop-func
      newValue.forEach((newVal) => {
        if (newVal === '[DONE]') {
          return;
        }

        try {
          const json = JSON.parse(newVal);

          if (!json.choices?.length) {
            throw new Error('Something went wrong.');
          }

          const choice = json.choices[0];

          console.log(choice.text);

          this.setState({ "body": ((prev) => prev + choice.text)});

          console.log(this.state.body);

        } catch (error) {
          tempState = newVal;
        }
      });
    }

  };


  // Handle Dark Mode
  handleDarkMode = async (client, color) => {

    let mode = '';

    if (color == "light") {
      mode = ` turn the <div class="dark"> into <div class="light">`;
    }

    if (color == "dark") {
      mode = ` turn the <div class="light"> into <div class="dark">`;
    };

    // Assert Code
    const res = await fetch('/api/ai/assertCode', {
      method: 'POST',
      headers: {
        'token': this.context.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "body": mode
      })
    });
    const gpt_text = await res.json();

    this.handleResponse(res.status, gpt_text.choices[0].text, client.mutate, true)
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
            username: this.state.user,
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
              if ((this.state.body) && (!this.state.body.includes('make the', 'code', '/code', 'put a', 'draw a', 'alert'))) {
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
              } else if (this.state.body.includes('make the', 'code', '/code', 'put a', 'draw a', 'alert')) {
                insert_message();
                this.handleCode(client);
                this.setState({
                  body: ""
                });
              } else if (this.state.body.includes('/dark-mode')) {
                insert_message();
                this.handleDarkMode(client, "dark");
                this.setState({
                  body: ""
                });
              } else if (this.state.body.includes('/light-mode')) {
                insert_message();
                this.handleDarkMode(client, "light");
                this.setState({
                  body: ""
                });
              } else if (this.state.body.includes('/answer')) {
                insert_message();
                this.generateAnswer(client);
                this.setState({
                  body: ""
                });
              } else if (this.state.body.includes('/edit')) {
                insert_message();
                this.generateEdit(client);
                this.setState({
                  body: ""
                });
              } else if (this.state.body.includes('/translate')) {
                insert_message();
                this.generateTranslation(client);
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
      <form className="dark:bg-slate-900" onSubmit={sendMessage}>
        <TypingIndicator username={this.state.user} />
        <div className="dark:bg-slate-900 inline-flex items-center justify-between">
          <textarea
            id="textbox"
            className="mb-3 m-2 py-2 px-8 w-64 mr-2 ml-4 rounded-full border dark:text-white dark:bg-slate-900 border-gray-300 bg-gray-100 resize-none"
            placeholder="Type a Message..."
            value={this.state.body}
            rows="1"
            autoFocus={false}
            onChange={(e) => {
              this.handleTyping(e.target.value, client.mutate);
            }}
          />
        </div>
        <button type="button" type="submit" className="inline-flex items-center px-4 py-2 mt-4 ml-5 mr-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Send
        </button>
        <br />
      </form>
    );
  }
}