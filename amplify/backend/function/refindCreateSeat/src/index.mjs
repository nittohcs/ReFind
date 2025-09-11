/* Amplify Params - DO NOT EDIT
	API_REFIND_GRAPHQLAPIENDPOINTOUTPUT
	API_REFIND_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_REFIND_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const { Sha256 } = crypto;

const createSeat = /* GraphQL */ `mutation CreateSeat(
  $input: CreateSeatInput!
  $condition: ModelSeatConditionInput
) {
  createSeat(input: $input, condition: $condition) {
    id
    tenantId
    floorId
    name
    posX
    posY
    createdAt
    updatedAt
    __typename
  }
}
`;

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler}
 */
 export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const input = event.arguments.input;
  const groups = event.identity?.groups;
  const isSysAdmins = groups.indexOf("sysAdmins") >= 0;

  if (groups.indexOf("admins") < 0) {
    throw new Error("User does not have permissions to create seats");
  }

  const tenantId = groups.find(x => x !== "sysAdmins" && x !== "admins" && x !== "users") ?? "";
  if (!isSysAdmins && !tenantId) {
    throw new Error("Empty tenantId");
  }

  // sysAdmins以外ならtenantIdをチェック
  if (!isSysAdmins && input.tenantId !== tenantId) {
    throw new Error("Invalid tenantId");
  }

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
      query: createSeat,
      variables: {
        input
      }
    }),
    path: endpoint.pathname
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);
  const response = await fetch(request);
  const body = await response.json();
  return body.data.createSeat;
};
