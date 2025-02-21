
const crypto = require('@aws-crypto/sha256-js');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { HttpRequest } = require('@aws-sdk/protocol-http');
//const fetch = require('node-fetch').default;

const GRAPHQL_ENDPOINT = process.env.API_REFIND2_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const { Sha256 } = crypto;

const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
    id
    tenantId
    email
    name
    comment
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
    comment
    isAdmin
    confirmingEmail
    createdAt
    updatedAt
    __typename
  }
}
`;

const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
    id
    tenantId
    email
    name
    comment
    isAdmin
    confirmingEmail
    createdAt
    updatedAt
    __typename
  }
}
`;

const getTenant = /* GraphQL */ `query GetTenant($id: ID!) {
  getTenant(id: $id) {
    id
    name
    maxUserCount
    initialPassword
    retentionPeriodDays
    isSuspended
    createdAt
    updatedAt
    __typename
  }
}
`;

const usersByTenantIdForUserCount = /* GraphQL */ `query UsersByTenantId(
  $tenantId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  usersByTenantId(
    tenantId: $tenantId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
    }
    nextToken
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
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const body = await response.json();
    return body;
}

async function graphqlCreateUser({ id, tenantId, email, name, comment, isAdmin }) {
    const input = {
        id,
        tenantId,
        email,
        name,
        comment,
        isAdmin,
    };
    const ret = await graphqlAccess(createUser, { input });
    return ret.data.createUser;
}

async function graphqlUpdateUser({ id, email, name, comment, isAdmin }) {
    const input = {
        id,
        ...(email !== undefined && { email }),
        ...(name !== undefined && { name }),
        ...(comment !== undefined && { comment }),
        ...(isAdmin !== undefined && { isAdmin }),
    };
    const ret = await graphqlAccess(updateUser, { input });
    return ret.data.updateUser;
}

async function graphqlDeleteUser({ id }) {
    const input = {
        id,
    };
    const ret = await graphqlAccess(deleteUser, { input });
    return ret.data.deleteUser;
}

async function graphqlGetTenant({ id }) {
  const ret = await graphqlAccess(getTenant, { id });
  return ret.data.getTenant;
}

async function graphqlGetUserCount({ tenantId }) {
  let count = 0;

  let nextToken = undefined;
  do {
    const ret = await graphqlAccess(usersByTenantIdForUserCount, { tenantId, nextToken });
    count += ret.data.usersByTenantId.items.length;
    nextToken = ret.data.usersByTenantId.nextToken;
  } while(nextToken);

  return count;
}

module.exports = {
    graphqlCreateUser,
    graphqlUpdateUser,
    graphqlDeleteUser,
    graphqlGetTenant,
    graphqlGetUserCount,
};
