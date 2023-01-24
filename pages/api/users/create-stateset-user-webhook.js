const fetch = require('node-fetch');
const { GraphQLClient, gql } = require('graphql-request');
import { uuid } from "uuidv4";
import { Webhook } from "svix";


const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

export default async function (req, res) {

  var stateset_customer_and_stateset_user;
  const sso_id = uuid();
  const object = req.body.object;
  const event_type = req.body.type;
  const user_id = req.body.data.id;
  const first_name = req.body.data.first_name;
  const last_name = req.body.data.last_name;
  const username = req.body.data.username;
  const email = req.body.data.email_addresses[0].email_address;
  const avatar = req.body.data.profile_image_url;

  stateset_customer_and_stateset_user = { "stateset_customer_and_stateset_user": { "sso_id": sso_id, "firstName": first_name, "lastName": last_name, "username": username, "email": email, "user": { data: { "id": user_id, "name": username, "username": username, "firstName": first_name, "lastName": last_name, "email": email, "active": true, "avatar": avatar } } } } ;

    const CREATE_STATESET_CUSTOMER_AND_STATESET_USER = gql`mutation createCustomer($stateset_customer_and_stateset_user: stateset_customers_insert_input!) {
        insert_stateset_customers(objects: [$stateset_customer_and_stateset_user]) {
          returning {
              sso_id
              firstName
              lastName
              phone
              email
              stripe_customer_id
              timestamp
              username
              user_id
              user {
                id
                firstName
                lastName
                username
                email
                avatar
                active
              }
            }
          }
      }`;


    const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
        "x-hasura-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET,
      },
    });

    const dataCreateCustomer = await graphQLClient.request(CREATE_STATESET_CUSTOMER_AND_STATESET_USER, stateset_customer_and_stateset_user);

    console.log('sending request');
    console.log(dataCreateCustomer);

    return res.status(200).json({ status: "created_stateset_customer_and_stateset_user" });

};