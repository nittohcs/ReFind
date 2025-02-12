/**
 * @type {import('@types/aws-lambda').PreTokenGenerationTriggerHandler}
 */
exports.handler = async (event) => {
  //console.log("Pre Token Generation Trigger Invoked, event:", event);
  const tenantId = event.request.userAttributes["custom:tenantId"] || "";

  // アクセストークンにカスタム属性は追加できないぽい 
  // event.response = {
  //   claimsOverrideDetails: {
  //     claimsToAddOrOverride: {
  //       "custom:tenantId": tenantId,
  //     },
  //   },
  // };

  // なのでグループにカスタム属性を追加する
  // tenantIdのグループは存在してないが問題なく追加できる
  const groups = event.request.groupConfiguration.groupsToOverride || [];
  //console.log("Existing Groups:", groups);
  if (tenantId) {
    groups.push(tenantId);
  }
  event.response = {
    claimsOverrideDetails: {
      groupOverrideDetails: {
        groupsToOverride: groups,
      },
    },
  };
  //console.log("Modified Claims:", event.response);
  // Return to Amazon Cognito
  return event;
};

// PreTokenGenerationV2TriggerHandlerを使えばアクセストークンにカスタム属性を追加できるが
// amplify pushのたびにトリガーイベントバージョンがV1_0に戻されてしまう
/**
 * @type {import('@types/aws-lambda').PreTokenGenerationV2TriggerHandler}
 */
/*exports.handler = async (event) => {
  //console.log("Pre Token Generation V2 Trigger Invoked, event:", JSON.stringify(event, null, 2));
  const tenantId = event.request.userAttributes["custom:tenantId"] || "";

  //const groups = event.request.groupConfiguration.groupsToOverride || [];
  //if (tenantId) {
  //  groups.push(tenantId);
  //}
  event.response = {
    claimsAndScopeOverrideDetails: {
      //idTokenGeneration: {
      //  claimsToAddOrOverride: {
      //    "custom:tenantId": tenantId,
      //  },
      //},
      accessTokenGeneration: {
        claimsToAddOrOverride: {
          "custom:tenantId": tenantId,
        },
        claimsToSuppress: [],
      },
      //groupOverrideDetails: {
      //  groupsToOverride: groups,
      //},
    },
  };

  //console.log("Modified Claims and Groups:", JSON.stringify(event.response, null, 2));
  // Return to Amazon Cognito
  return event;
};*/
