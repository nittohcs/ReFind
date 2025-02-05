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
