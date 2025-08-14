/* eslint-disable */
/*
 * Copyright 2019-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

const {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  AdminConfirmSignUpCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  AdminRemoveUserFromGroupCommand,
  AdminUserGlobalSignOutCommand,
  ListGroupsCommand,
  ListUsersCommand,
  ListUsersInGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminSetUserPasswordCommand ,
} = require('@aws-sdk/client-cognito-identity-provider');

const cognitoIdentityProviderClient = new CognitoIdentityProviderClient({});
const userPoolId = process.env.USERPOOL;

async function setUserPassword(username, password) {
  const input = {
    UserPoolId: userPoolId,
    Username: username,
    Password: password,
    Permanent: false,
  };

  console.log(`Attempting to set user password: ${username}`);

  try {
    await cognitoIdentityProviderClient.send(new AdminSetUserPasswordCommand(input));
    return {
      message: `Set user password: ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function updateUserAttributes(username, attributes) {
  const input = {
    UserPoolId: userPoolId,
    Username: username,
    UserAttributes: attributes,
  };

  console.log(`Attempting to update userAttributes: ${username}`);

  try {
    await cognitoIdentityProviderClient.send(new AdminUpdateUserAttributesCommand(input));
    return {
      message: `Update userAttributes: ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function createUser(username, attributes, messageAction, initialPassword) {
  const input = {
    UserPoolId: userPoolId,
    Username: username,
    UserAttributes: attributes,
    MessageAction: messageAction,
    TemporaryPassword: initialPassword,
  };

  console.log(`Attempting to create user: ${username}`);

  try {
    await cognitoIdentityProviderClient.send(new AdminCreateUserCommand(input));
    return {
      message: `Created ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function deleteUser(username) {
  const input = {
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to delete user: ${username}`);

  try {
    await cognitoIdentityProviderClient.send(new AdminDeleteUserCommand(input));
    return {
      message: `Deleted ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function addUserToGroup(username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to add ${username} to ${groupname}`);

  try {
    await cognitoIdentityProviderClient.send(new AdminAddUserToGroupCommand(params));
    console.log(`Success adding ${username} to ${groupname}`);
    return {
      message: `Success adding ${username} to ${groupname}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function removeUserFromGroup(username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to remove ${username} from ${groupname}`);

  try {
    await cognitoIdentityProviderClient.send(new AdminRemoveUserFromGroupCommand(params));
    console.log(`Removed ${username} from ${groupname}`);
    return {
      message: `Removed ${username} from ${groupname}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Confirms as an admin without using a confirmation code.
async function confirmUserSignUp(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    await cognitoIdentityProviderClient.send(new AdminConfirmSignUpCommand(params));
    console.log(`Confirmed ${username} registration`);
    return {
      message: `Confirmed ${username} registration`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function disableUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    await cognitoIdentityProviderClient.send(new AdminDisableUserCommand(params));
    console.log(`Disabled ${username}`);
    return {
      message: `Disabled ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function enableUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    await cognitoIdentityProviderClient.send(new AdminEnableUserCommand(params));
    console.log(`Enabled ${username}`);
    return {
      message: `Enabled ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to retrieve information for ${username}`);

  try {
    const result = await cognitoIdentityProviderClient.send(new AdminGetUserCommand(params));
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listUsers(Limit, PaginationToken) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken }),
  };

  console.log('Attempting to list users');

  try {
    const result = await cognitoIdentityProviderClient.send(new ListUsersCommand(params));

    // Rename to NextToken for consistency with other Cognito APIs
    result.NextToken = result.PaginationToken;
    delete result.PaginationToken;

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listAllUsers() {
  try {
    const users = [];

    /** @type {string | undefined} */
    let PaginationToken = undefined;
    do {
      const params = {
        UserPoolId: userPoolId,
        ...(PaginationToken && { PaginationToken }),
      };

      const result = await cognitoIdentityProviderClient.send(new ListUsersCommand(params));

      for (const user of result.Users) {
        users.push({
          id: user.Username,
          email: user.Attributes.find(x => x.Name === "email")?.Value ?? "",
          name: user.Attributes.find(x => x.Name === "name")?.Value ?? "",
          tenantId: user.Attributes.find(x => x.Name === "custom:tenantId")?.Value ?? "",
        });
      }

      PaginationToken = result.PaginationToken;
    } while (!!PaginationToken);

    return users;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listGroups(Limit, NextToken) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  };

  console.log('Attempting to list groups');

  try {
    const result = await cognitoIdentityProviderClient.send(new ListGroupsCommand(params));

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listGroupsForUser(username, Limit, NextToken) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  };

  console.log(`Attempting to list groups for ${username}`);

  try {
    const result = await cognitoIdentityProviderClient.send(new AdminListGroupsForUserCommand(params));
    /**
     * We are filtering out the results that seem to be innapropriate for client applications
     * to prevent any informaiton disclosure. Customers can modify if they have the need.
     */
    result.Groups.forEach((val) => {
      delete val.UserPoolId, delete val.LastModifiedDate, delete val.CreationDate, delete val.Precedence, delete val.RoleArn;
    });

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listUsersInGroup(groupname, Limit, NextToken) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  };

  console.log(`Attempting to list users in group ${groupname}`);

  try {
    const result = await cognitoIdentityProviderClient.send(new ListUsersInGroupCommand(params));
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listAllUsersInGroup(groupname) {
  try {
    const users = [];

    /** @type {string | undefined} */
    let NextToken = undefined;
    do {
      const params = {
        GroupName: groupname,
        UserPoolId: userPoolId,
        ...(NextToken && { NextToken }),
      };

      const result = await cognitoIdentityProviderClient.send(new ListUsersInGroupCommand(params));

      for (const user of result.Users) {
        users.push({
          id: user.Username,
          email: user.Attributes.find(x => x.Name === "email")?.Value ?? "",
          name: user.Attributes.find(x => x.Name === "name")?.Value ?? "",
          tenantId: user.Attributes.find(x => x.Name === "custom:tenantId")?.Value ?? "",
        });
      }

      NextToken = result.NextToken;
    } while (!!NextToken);

    return users;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Signs out from all devices, as an administrator.
async function signUserOut(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to signout ${username}`);

  try {
    await cognitoIdentityProviderClient.send(new AdminUserGlobalSignOutCommand(params));
    console.log(`Signed out ${username} from all devices`);
    return {
      message: `Signed out ${username} from all devices`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  setUserPassword,
  updateUserAttributes,
  createUser,
  deleteUser,
  addUserToGroup,
  removeUserFromGroup,
  confirmUserSignUp,
  disableUser,
  enableUser,
  getUser,
  listUsers,
  listAllUsers,
  listGroups,
  listGroupsForUser,
  listUsersInGroup,
  listAllUsersInGroup,
  signUserOut,
};
