/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createFloor = /* GraphQL */ `mutation CreateFloor(
  $input: CreateFloorInput!
  $condition: ModelFloorConditionInput
) {
  createFloor(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateFloorMutationVariables,
  APITypes.CreateFloorMutation
>;
export const updateFloor = /* GraphQL */ `mutation UpdateFloor(
  $input: UpdateFloorInput!
  $condition: ModelFloorConditionInput
) {
  updateFloor(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateFloorMutationVariables,
  APITypes.UpdateFloorMutation
>;
export const deleteFloor = /* GraphQL */ `mutation DeleteFloor(
  $input: DeleteFloorInput!
  $condition: ModelFloorConditionInput
) {
  deleteFloor(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteFloorMutationVariables,
  APITypes.DeleteFloorMutation
>;
