
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
    isAdmin
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
    isAdmin
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
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const body = await response.json();
    return body;
}

async function graphqlCreateUser({ id, tenantId, email, name, isAdmin }) {
    const input = {
        id,
        tenantId,
        email,
        name,
        isAdmin,
    };
    const ret = await graphqlAccess(createUser, { input });
    return ret.data.createUser;
}

async function graphqlUpdateUser({ id, email, name, isAdmin }) {
    const input = {
        id,
        ...(email !== undefined && { email }),
        ...(name !== undefined && { name }),
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

module.exports = {
    graphqlCreateUser,
    graphqlUpdateUser,
    graphqlDeleteUser,
};
