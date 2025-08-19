/**
 * @type {import('@types/aws-lambda').PreTokenGenerationTriggerHandler}
 */
exports.handler = async (event) => {

  // 元のソース
  // event.response = {
  //   claimsOverrideDetails: {
  //     claimsToAddOrOverride: {
  //       attribute_key1: 'attribute_value1',
  //       attribute_key2: 'attribute_value2',
  //     },
  //     claimsToSuppress: ['attribute_key3'],
  //   },
  // };

  // ユーザー属性からカスタム属性 "custom:tenantId" を取得（存在しない場合は空文字）
  const tenantId = event.request.userAttributes["custom:tenantId"] || "";

  // 現在のグループ上書き設定を取得（存在しない場合は空の配列）
  const groups = event.request.groupConfiguration.groupsToOverride || [];

  if (tenantId) {
    groups.push(tanentId);
  }

  // トークンに含めるグループ情報を上書き設定として response にセット
  event.response = {
    claimsOverrideDetails: {
      groupOverrideDetails: {
        groupsToOverride: groups,
      },
    },
  };
  // Return to Amazon Cognito
  return event;
};
