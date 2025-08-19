export type AmplifyDependentResourcesAttributes = {
  "api": {
    "AdminQueries": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "refind": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    }
  },
  "auth": {
    "refind56920dcf": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    },
    "userPoolGroups": {
      "adminsGroupRole": "string",
      "sysAdminsGroupRole": "string",
      "usersGroupRole": "string"
    }
  },
  "function": {
    "AdminQueries62758162": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "refind56920dcfPreTokenGeneration": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "ReFindStorage": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}