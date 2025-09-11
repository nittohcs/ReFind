/* Amplify Params - DO NOT EDIT
	API_REFIND_GRAPHQLAPIENDPOINTOUTPUT
	API_REFIND_GRAPHQLAPIIDOUTPUT
	AUTH_REFINDA0622A88_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import { CognitoIdentityProviderClient, VerifyUserAttributeCommand } from '@aws-sdk/client-cognito-identity-provider';

import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_REFIND_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const { Sha256 } = crypto;

const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });

const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
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

  const username = event.identity?.username;
  const { accessToken, attributeName, code } = event.arguments?.input || {};

  const command = new VerifyUserAttributeCommand({
    AccessToken: accessToken,
    AttributeName: attributeName,
    Code: code,
  });
  const response = await cognitoClient.send(command);
  console.log(`response: ${JSON.stringify(response)}`);

  // DBから検証中のメールアドレスを取得
  const getResult = await graphqlAccess(getUser, { id: username });
  const user = getResult.data.getUser;

  // DB更新
  const input = {
    id: username,
    email: user.confirmingEmail,
    confirmingEmail: null,
  };
  const updateResult = await graphqlAccess(updateUser, { input });
  console.log(`updateResult: ${JSON.stringify(updateResult)}`);

  return true;
};
