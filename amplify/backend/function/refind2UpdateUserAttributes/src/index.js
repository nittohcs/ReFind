/* Amplify Params - DO NOT EDIT
	API_REFIND2_GRAPHQLAPIENDPOINTOUTPUT
	API_REFIND2_GRAPHQLAPIIDOUTPUT
	AUTH_REFIND2A0622A88_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import { CognitoIdentityProviderClient, UpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';

import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_REFIND2_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const { Sha256 } = crypto;

const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });

const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
    id
    tenantId
    email
    name
    isAdmin
    confirmingEmail
    createdAt
    updatedAt
    __typename
  }
}
`;

async function graphqlAccess(query, variables) {
  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: 'appsync',
    sha256: Sha256
  });

  const requestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host
    },
    hostname: endpoint.host,
    body: JSON.stringify({
      query,
      variables
    }),
    path: endpoint.pathname
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);
  const response = await fetch(request);
  const body = await response.json();
  return body;
}

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler}
 */
 export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const ret = {
    isUpdatedEmail: false,
    isUpdatedName: false,
    isRequiredVerification: false,
  };

  const username = event.identity?.username;
  const { accessToken, email, name } = event.arguments?.input || {};

  const userAttributes = [];
  if (email) {
    userAttributes.push({ Name: "email", Value: email });
  }
  if (name) {
    userAttributes.push({ Name: "name", Value: name });
  }

  const command = new UpdateUserAttributesCommand({
    AccessToken: accessToken,
    UserAttributes: userAttributes,
  });
  const response = await cognitoClient.send(command);

  console.log(`response: ${JSON.stringify(response)}`);

  if (response.CodeDeliveryDetailsList && response.CodeDeliveryDetailsList.length > 0) {
    ret.isRequiredVerification = true;
  }

  // DB更新
  const input = {
    id: username,
  };
  if (email) {
    if (ret.isRequiredVerification) {
      input.confirmingEmail = email;
    } else {
      input.email = email;
      ret.isUpdatedEmail = true;
    }
  }
  if (name) {
    input.name = name;
    ret.isUpdatedName = true;
  }
  const updateResult = await graphqlAccess(updateUser, { input });
  console.log(`updateResult: ${JSON.stringify(updateResult)}`);

  return ret;
};
