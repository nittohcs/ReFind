/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const funcCreateFloor = /* GraphQL */ `mutation FuncCreateFloor($input: funcCreateFloorInput!) {
  funcCreateFloor(input: $input) {
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
  APITypes.FuncCreateFloorMutationVariables,
  APITypes.FuncCreateFloorMutation
>;
export const funcUpdateFloor = /* GraphQL */ `mutation FuncUpdateFloor($input: funcUpdateFloorInput!) {
  funcUpdateFloor(input: $input) {
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
  APITypes.FuncUpdateFloorMutationVariables,
  APITypes.FuncUpdateFloorMutation
>;
export const createTenant = /* GraphQL */ `mutation CreateTenant(
  $input: CreateTenantInput!
  $condition: ModelTenantConditionInput
) {
  createTenant(input: $input, condition: $condition) {
    id
    name
    isSuspended
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTenantMutationVariables,
  APITypes.CreateTenantMutation
>;
export const updateTenant = /* GraphQL */ `mutation UpdateTenant(
  $input: UpdateTenantInput!
  $condition: ModelTenantConditionInput
) {
  updateTenant(input: $input, condition: $condition) {
    id
    name
    isSuspended
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTenantMutationVariables,
  APITypes.UpdateTenantMutation
>;
export const deleteTenant = /* GraphQL */ `mutation DeleteTenant(
  $input: DeleteTenantInput!
  $condition: ModelTenantConditionInput
) {
  deleteTenant(input: $input, condition: $condition) {
    id
    name
    isSuspended
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTenantMutationVariables,
  APITypes.DeleteTenantMutation
>;
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
