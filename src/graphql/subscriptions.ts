/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateFloor = /* GraphQL */ `subscription OnCreateFloor($filter: ModelSubscriptionFloorFilterInput) {
  onCreateFloor(filter: $filter) {
    id
    tenantId
    name
    imagePath
    imageWidth
    imageHeight
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateFloorSubscriptionVariables,
  APITypes.OnCreateFloorSubscription
>;
export const onUpdateFloor = /* GraphQL */ `subscription OnUpdateFloor($filter: ModelSubscriptionFloorFilterInput) {
  onUpdateFloor(filter: $filter) {
    id
    tenantId
    name
    imagePath
    imageWidth
    imageHeight
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateFloorSubscriptionVariables,
  APITypes.OnUpdateFloorSubscription
>;
export const onDeleteFloor = /* GraphQL */ `subscription OnDeleteFloor($filter: ModelSubscriptionFloorFilterInput) {
  onDeleteFloor(filter: $filter) {
    id
    tenantId
    name
    imagePath
    imageWidth
    imageHeight
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteFloorSubscriptionVariables,
  APITypes.OnDeleteFloorSubscription
>;
