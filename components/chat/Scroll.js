import React, { Component, Fragment } from "react";
import gql from "graphql-tag";
import {withApollo, Subscription} from 'react-apollo';
import Message from "./Message";

class Scroll extends Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.scrollRef = React.createRef();
  }

  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate() {
      this.scrollToBottom()
  }

  scrollToBottom = () => {
    this.scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }


  render() {
    return (
      <div ref={this.scrollRef}>
    </div>
    )
  }
};

export default Scroll;