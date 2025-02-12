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

const DEFAULT_NUM_DAYS = process.env.DEFAULT_NUM_DAYS ? parseInt(process.env.DEFAULT_NUM_DAYS, 10) : 7;

const listSeatOccupancies = /* GraphQL */ `query ListSeatOccupancies(
  $filter: ModelSeatOccupancyFilterInput
  $limit: Int
  $nextToken: String
) {
  listSeatOccupancies(filter: $filter, limit: $limit, nextToken: $nextToken) {
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

/**
 * @param {Date} date 
 * @returns 
 */
function getDateYYYYMMDD(date) {
  const yyyy = date.getFullYear();
  const mm = ("00" + (date.getMonth() + 1)).slice(-2);
  const dd = ("00" + date.getDate()).slice(-2);
  return `${yyyy}${mm}${dd}`;
}

/**
 * @param {string} date 
 */
async function listSeatOccupanciesBeforeDate(date) {
  const ret = [];

  /** @type {string | undefined} */ 
  let nextToken = undefined;
  do {
    const response = await graphqlListSeatOccupanciesBeforeDate(date, nextToken);
    const items = response.data?.listSeatOccupancies?.items ?? [];
    for(let i = 0; i < items.length; ++i) {
      const item = items[i];
      if (item) {
        ret.push(item);
      }
    }
    nextToken = response.data?.listSeatOccupancies?.nextToken;
  } while(nextToken);

  return ret;
}

/**
 * @param {string} date 
 * @param {string | undefined} nextToken 
 */
async function graphqlListSeatOccupanciesBeforeDate(date, nextToken) {
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
      query: listSeatOccupancies,
      variables: {
        filter: {
          date: { le: date }
        },
        nextToken,
      },
    }),
    path: endpoint.pathname
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);
  const response = await fetch(request);
  const body = await response.json();
  if (body.errors) {
    console.log(`error: graphqlListSeatOccupanciesBeforeDate: date=${date}, nextToken=${nextToken}, ${JSON.stringify(body.errors, null, 2)}`);
  }
  return body;
}

async function deleteSeatOccupancies(seatOccupancies) {
  const ret = [];

  for(let i = 0; i < seatOccupancies.length; ++i) {
    const seatOccupancy = seatOccupancies[i];
    const response = await graphqlDeleteSeatOccupancy(seatOccupancy);
    ret.push(response.data?.deleteSeatOccupancy);
  }

  return ret;
}

async function graphqlDeleteSeatOccupancy(seatOccupancy) {
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
      query: deleteSeatOccupancy,
      variables: {
        input: { id: seatOccupancy.id },
      },
    }),
    path: endpoint.pathname
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);
  const response = await fetch(request);
  const body = await response.json();
  if (body.errors) {
    console.log(`error: graphqlDeleteSeatOccupancy: id=${seatOccupancy.id}, ${JSON.stringify(body.errors, null, 2)}`);
  }
  return body;
}

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler}
 */
export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  let numDays = DEFAULT_NUM_DAYS;
  if (event.arguments && typeof event.arguments.numDays === "number") {
    numDays = event.arguments.numDays;
  }
  const today = new Date();
  const oldDate = new Date(today);
  oldDate.setDate(today.getDate() - numDays);
  const filterDate = getDateYYYYMMDD(oldDate);
  const seatOccupancies = await listSeatOccupanciesBeforeDate(filterDate);
  const ret = await deleteSeatOccupancies(seatOccupancies);
  console.log(`${ret.length} data items have been deleted.`);
  return ret;
};
