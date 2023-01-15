import React, { Component, Fragment } from "react";
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import UserRecord from './UserRecord';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'


const GET_MY_USER = gql`
query getMyUsers($username: String) {
  users(where: {username: {_eq: $username}}) {
    id
    firstName
    lastName
    organization
    email
    bio
    phone
    title
    username
    location
    country
    avatar
    twitter
    birthday
  }
}
`;

let easing = [0.175, 0.85, 0.42, 0.96];

const textVariants = {
  exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.1, duration: 0.5, ease: easing }
  }
};



class UserRecordPrivateList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        filter: "all",
        clearInProgress: false,
      };

      this.filterResults = this.filterResults.bind(this);
      this.clearCompleted = this.clearCompleted.bind(this);
    }

    filterResults(filter) {
      this.setState({
        ...this.state,
        filter: filter
      });
    }

    clearCompleted() {}
    
    render() {

      const { username } = this.props;

      const { users } = this.props;

      let myUsers = users;

      const userList = [];
      myUsers.forEach((user, index) => {
        userList.push(
          <UserRecord
            key={index}
            index={index}
            user={user}
            username={username}
          />
        );
      });

      return (
        <Fragment>
          <motion.div initial="exit" animate="enter" exit="exit">
          <motion.div variants={textVariants}>
            <ul>
              { userList }
              <br/>
            </ul>
            </motion.div>
            </motion.div>
        </Fragment>
      );
    }
  }
  

 const UserRecordPrivateListQuery = (username) => {

  return ( 
  <Query query={GET_MY_USER} variables={username}>
      {({ loading, error, data, client}) => {
        if (loading) {
          return (<div></div>);
        }
        if (error) {
          console.error(error);
          return (<div>Error Loading User Graph!</div>);
        }
        return (<UserRecordPrivateList client={client} users={data.users} username={username} />);
      }}
    </Query>
  );
 };


export default UserRecordPrivateListQuery;