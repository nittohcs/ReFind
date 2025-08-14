/* Amplify Params - DO NOT EDIT
	API_REFIND2_GRAPHQLAPIENDPOINTOUTPUT
	API_REFIND2_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_REFIND2_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const { Sha256 } = crypto;

const seatOccupanciesByTenantId = /* GraphQL */ `query SeatOccupanciesByTenantId(
  $tenantId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelSeatOccupancyFilterInput
  $limit: Int
  $nextToken: String
) {
  seatOccupanciesByTenantId(
    tenantId: $tenantId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      tenantId
      seatId
      userId
      userName
      date
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
`;

const deleteSeatOccupancy = /* GraphQL */ `mutation DeleteSeatOccupancy(
  $input: DeleteSeatOccupancyInput!
  $condition: ModelSeatOccupancyConditionInput
) {
  deleteSeatOccupancy(input: $input, condition: $condition) {
    id
    tenantId
    seatId
    userId
    userName
    date
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

async function listAllSeatOccupanciesByTenantId(tenantId) {
  const ret = [];

  /** @type {string | undefined} */
  let nextToken = undefined;
  do {
    const response = await graphqlAccess(seatOccupanciesByTenantId, {
      tenantId,
      nextToken,
    });
    const items = response.data?.seatOccupanciesByTenantId?.items ?? [];
    for(const item of items) {
      if (item) {
        ret.push(item);
      }
    }
    nextToken = response.data?.seatOccupanciesByTenantId?.nextToken;
  } while(nextToken);

  return ret;
}

async function deleteSeatOccupancies(seatOccupancies) {
  const ret = [];

  for(const seatOccupancy of seatOccupancies) {
    const response = await graphqlAccess(deleteSeatOccupancy, {
      input: { id: seatOccupancy.id },
    });
    if (response.data?.deleteSeatOccupancy) {
      ret.push(response.data.deleteSeatOccupancy);
    }
  }

  return ret;
}

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler}
 */
export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const input = event.arguments.input;
  const groups = event.identity?.groups;
  const isSysAdmins = groups.indexOf("sysAdmins") >= 0;

  // 実行できるのはシステム管理者だけ
  if (!isSysAdmins) {
    throw new Error("User does not have permissions to clear seatOccupancies");
  }

  const seatOccupancies = await listAllSeatOccupanciesByTenantId(input.id);
  const ret = await deleteSeatOccupancies(seatOccupancies);
  console.log(`tenant=${input.id}: ${ret.length} data items have been deleted.`);

  return ret;
};
