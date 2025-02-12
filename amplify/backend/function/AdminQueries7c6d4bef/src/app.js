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
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const {
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
} = require('./cognitoActions');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Only perform tasks if the user is in a specific group
const allowedGroup = process.env.GROUP;

const checkGroup = function (req, res, next) {
  // 通常のAdminQueriesでは'/signUserOut'のみ全ユーザーに許可されているが
  // '/listUsersByTenantId'と'/listUsersInGroupByTenantId'も許可する
  const allowedPaths = ['/signUserOut', '/listUsersByTenantId', '/listUsersInGroupByTenantId']
  if (allowedPaths.includes(req.path)) {
    return next();
  }

  if (typeof allowedGroup === 'undefined' || allowedGroup === 'NONE') {
    return next();
  }

  // Fail if group enforcement is being used
  if (req.apiGateway.event.requestContext.authorizer.claims['cognito:groups']) {
    const groups = req.apiGateway.event.requestContext.authorizer.claims['cognito:groups'].split(',');
    if (!(allowedGroup && groups.indexOf(allowedGroup) > -1)) {
      const err = new Error(`User does not have permissions to perform administrative tasks`);
      next(err);
    }
  } else {
    const err = new Error(`User does not have permissions to perform administrative tasks`);
    err.statusCode = 403;
    next(err);
  }
  next();
};

const getGroups = function(req) {
  return req.apiGateway.event.requestContext.authorizer.claims['cognito:groups'].split(',');
}

const getTenantId = function (groups) {
  // sysAdmins,admins,usersではないものがtenantId
  return groups.find(x => x !== "sysAdmins" && x !== "admins" && x !== "users");
}

const isSysAdmins = function (groups) {
  return groups.indexOf("sysAdmins") >= 0;
}

const getUserTenantId = function (userData)  {
  return userData.UserAttributes.find(x => x.Name === "custom:tenantId")?.Value;
}

app.all('*', checkGroup);

app.post('/setUserPassword', async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    const err = new Error('username and password are required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const groups = getGroups(req);

    // sysAdminsではない場合、tenantIdが一致するユーザーしか操作できない
    if (!isSysAdmins(groups)) {
      const tenantId = getTenantId(groups);

      const userData = await getUser(req.body.username);
      const userTenantId = getUserTenantId(userData);
      if (userTenantId !== tenantId) {
        const err = new Error('invalid tenantId');
        err.statusCode = 400;
        return next(err);
      }
    }

    const response = await setUserPassword(req.body.username, req.body.password);
    res.status(200).json(response);
  } catch(err) {
    next(err);
  }
});

app.post('/updateUserAttributes', async (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.name) {
    const err = new Error('username, email and name are required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const groups = getGroups(req);

    // sysAdminsではない場合、tenantIdが一致するユーザーしか操作できない
    if (!isSysAdmins(groups)) {
      const tenantId = getTenantId(groups);

      const userData = await getUser(req.body.username);
      const userTenantId = getUserTenantId(userData);
      if (userTenantId !== tenantId) {
        const err = new Error('invalid tenantId');
        err.statusCode = 400;
        return next(err);
      }
    }

    const attributes = [
      {
        Name: "email",
        Value: req.body.email,
      },
      {
        Name: "name",
        Value: req.body.name,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ];
    const response = await updateUserAttributes(req.body.username, attributes);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post('/createUser', async (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.name || !req.body.tenantId || !req.body.groupname) {
    const err = new Error('username, email, name, tenantId and groupname are required');
    err.statusCode = 400;
    return next(err);
  }

  if (req.body.groupname !== "admins" && req.body.groupname !== "users") {
    const err = new Error("invalid groupname");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const groups = getGroups(req);

    if (!isSysAdmins(groups)) {
      const tenantId = getTenantId(groups);
      if (req.body.tenantId !== tenantId) {
        const err = new Error('invalid tenantId');
        err.statusCode = 400;
        return next(err);
      }
    }

    // ユーザー作成
    const attributes = [
      {
        Name: "email",
        Value: req.body.email,
      },
      {
        Name: "name",
        Value: req.body.name,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
      {
        Name: "custom:tenantId",
        Value: req.body.tenantId,
      }
    ];
    const response = await createUser(req.body.username, attributes, req.body.messageAction);

    // グループに追加
    try {
      await addUserToGroup(req.body.username, req.body.groupname);
    } catch(err) {
      await deleteUser(req.body.username);
      return next(err);
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post('/deleteUser', async (req, res, next) => {
  if (!req.body.username) {
    const err = new Error('username is required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const groups = getGroups(req);

    // sysAdminsではない場合、tenantIdが一致するユーザーしか操作できない
    if (!isSysAdmins(groups)) {
      const tenantId = getTenantId(groups);

      const userData = await getUser(req.body.username);
      const userTenantId = getUserTenantId(userData);
      if (userTenantId !== tenantId) {
        const err = new Error('invalid tenantId');
        err.statusCode = 400;
        return next(err);
      }
    }

    const response = await deleteUser(req.body.username);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post('/addUserToGroup', async (req, res, next) => {
  if (!req.body.username || !req.body.groupname) {
    const err = new Error('username and groupname are required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const groups = getGroups(req);

    // sysAdminsではない場合、tenantIdが一致するユーザーしか操作できない
    if (!isSysAdmins(groups)) {
      const tenantId = getTenantId(groups);

      const userData = await getUser(req.body.username);
      const userTenantId = getUserTenantId(userData);
      if (userTenantId !== tenantId) {
        const err = new Error('invalid tenantId');
        err.statusCode = 400;
        return next(err);
      }
    }

    const response = await addUserToGroup(req.body.username, req.body.groupname);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post('/removeUserFromGroup', async (req, res, next) => {
  if (!req.body.username || !req.body.groupname) {
    const err = new Error('username and groupname are required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const groups = getGroups(req);

    // sysAdminsではない場合、tenantIdが一致するユーザーしか操作できない
    if (!isSysAdmins(groups)) {
      const tenantId = getTenantId(groups);

      const userData = await getUser(req.body.username);
      const userTenantId = getUserTenantId(userData);
      if (userTenantId !== tenantId) {
        const err = new Error('invalid tenantId');
        err.statusCode = 400;
        return next(err);
      }
    }

    const response = await removeUserFromGroup(req.body.username, req.body.groupname);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

/*
app.post('/confirmUserSignUp', async (req, res, next) => {
  if (!req.body.username) {
    const err = new Error('username is required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await confirmUserSignUp(req.body.username);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
*/

/*
app.post('/disableUser', async (req, res, next) => {
  if (!req.body.username) {
    const err = new Error('username is required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await disableUser(req.body.username);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
*/

/*
app.post('/enableUser', async (req, res, next) => {
  if (!req.body.username) {
    const err = new Error('username is required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await enableUser(req.body.username);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
*/

/*
app.get('/getUser', async (req, res, next) => {
  if (!req.query.username) {
    const err = new Error('username is required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await getUser(req.query.username);

    // sysAdminsではない場合、tenantIdが一致するユーザーしか操作できない
    const groups = getGroups(req);
    if (!isSysAdmins(groups)) {
      const tenantId = getTenantId(groups);
      console.log(`response:${JSON.stringify(response)}`);
      const userTenantId = getUserTenantId(response);
      if (userTenantId !== tenantId) {
        const err = new Error('invalid tenantId');
        err.statusCode = 400;
        return next(err);
      }
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
*/

/*
app.get('/listUsers', async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 25;
    const response = await listUsers(limit, req.query.token);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
*/

/*
app.get('/listAllUsers', async (req, res, next) => {
  try {
    const response = await listAllUsers();
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
*/

app.get('/listUsersByTenantId', async (req, res, next) => {
  if (!req.query.tenantId) {
    const err = new Error('tenantId is required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const groups = getGroups(req);

    // sysAdminsではない場合、自分のテナントのユーザーしか取得できない
    if (!isSysAdmins(groups)) {
      const tenantId = getTenantId(groups);
      if (req.query.tenantId !== tenantId) {
        const err = new Error('invalid tenantId');
        err.statusCode = 400;
        return next(err);
      }
    }

    const response = await listAllUsers();
    const filtered = response.filter(x => x.tenantId === req.query.tenantId);
    res.status(200).json(filtered);
  } catch (err) {
    next(err);
  }
});

/*
app.get('/listGroups', async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 25;
    const response = await listGroups(limit, req.query.token);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
*/

/*
app.get('/listGroupsForUser', async (req, res, next) => {
  if (!req.query.username) {
    const err = new Error('username is required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 25;
    const response = await listGroupsForUser(req.query.username, limit, req.query.token);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
*/

/*
app.get('/listUsersInGroup', async (req, res, next) => {
  if (!req.query.groupname) {
    const err = new Error('groupname is required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 25;
    const response = await listUsersInGroup(req.query.groupname, limit, req.query.token);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
*/

/*
app.get('/listAllUsersInGroup', async (req, res, next) => {
  if (!req.query.groupname) {
    const err = new Error('groupname is required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await listAllUsersInGroup(req.query.groupname);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
*/

app.get('/listUsersInGroupByTenantId', async (req, res, next) => {
  if (!req.query.tenantId || !req.query.groupname) {
    const err = new Error('tenantId and groupname is required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const groups = getGroups(req);

    // sysAdminsではない場合、自分のテナントのユーザーしか取得できない
    if (!isSysAdmins(groups)) {
      const tenantId = getTenantId(groups);
      if (req.query.tenantId !== tenantId) {
        const err = new Error('invalid tenantId');
        err.statusCode = 400;
        return next(err);
      }
    }

    const response = await listAllUsersInGroup(req.query.groupname);
    const filtered = response.filter(x => x.tenantId === req.query.tenantId);
    res.status(200).json(filtered);
  } catch (err) {
    next(err);
  }
});

app.post('/signUserOut', async (req, res, next) => {
  /**
   * To prevent rogue actions of users with escalated privilege signing
   * other users out, we ensure it's the same user making the call
   * Note that this only impacts actions the user can do in User Pools
   * such as updating an attribute, not services consuming the JWT
   */
  if (
    req.body.username != req.apiGateway.event.requestContext.authorizer.claims.username &&
    req.body.username != /[^/]*$/.exec(req.apiGateway.event.requestContext.identity.userArn)[0]
  ) {
    const err = new Error('only the user can sign themselves out');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await signUserOut(req.body.username);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

// Error middleware must be defined last
app.use((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).json({ message: err.message }).end();
});

app.listen(3000, () => {
  console.log('App started');
});

module.exports = app;
