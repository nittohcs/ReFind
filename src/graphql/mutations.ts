/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const deleteFile = /* GraphQL */ `mutation DeleteFile($filePath: String!) {
  deleteFile(filePath: $filePath)
}
` as GeneratedMutation<
  APITypes.DeleteFileMutationVariables,
  APITypes.DeleteFileMutation
>;
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
export const funcDeleteFloor = /* GraphQL */ `mutation FuncDeleteFloor($input: funcDeleteFloorInput!) {
  funcDeleteFloor(input: $input) {
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
  APITypes.FuncDeleteFloorMutationVariables,
  APITypes.FuncDeleteFloorMutation
>;
export const funcCreateSeatOccupancy = /* GraphQL */ `mutation FuncCreateSeatOccupancy($input: funcCreateSeatOccupancyInput!) {
  funcCreateSeatOccupancy(input: $input) {
    id
    tenantId
    seatId
    userId
    userName
    date
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.FuncCreateSeatOccupancyMutationVariables,
  APITypes.FuncCreateSeatOccupancyMutation
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
export const createSeat = /* GraphQL */ `mutation CreateSeat(
  $input: CreateSeatInput!
  $condition: ModelSeatConditionInput
) {
  createSeat(input: $input, condition: $condition) {
    id
    tenantId
    floorId
    name
    posX
    posY
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSeatMutationVariables,
  APITypes.CreateSeatMutation
>;
export const updateSeat = /* GraphQL */ `mutation UpdateSeat(
  $input: UpdateSeatInput!
  $condition: ModelSeatConditionInput
) {
  updateSeat(input: $input, condition: $condition) {
    id
    tenantId
    floorId
    name
    posX
    posY
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSeatMutationVariables,
  APITypes.UpdateSeatMutation
>;
export const deleteSeat = /* GraphQL */ `mutation DeleteSeat(
  $input: DeleteSeatInput!
  $condition: ModelSeatConditionInput
) {
  deleteSeat(input: $input, condition: $condition) {
    id
    tenantId
    floorId
    name
    posX
    posY
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSeatMutationVariables,
  APITypes.DeleteSeatMutation
>;
export const createSeatOccupancy = /* GraphQL */ `mutation CreateSeatOccupancy(
  $input: CreateSeatOccupancyInput!
  $condition: ModelSeatOccupancyConditionInput
) {
  createSeatOccupancy(input: $input, condition: $condition) {
    id
    tenantId
    seatId
    userId
    userName
    date
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSeatOccupancyMutationVariables,
  APITypes.CreateSeatOccupancyMutation
>;
export const updateSeatOccupancy = /* GraphQL */ `mutation UpdateSeatOccupancy(
  $input: UpdateSeatOccupancyInput!
  $condition: ModelSeatOccupancyConditionInput
) {
  updateSeatOccupancy(input: $input, condition: $condition) {
    id
    tenantId
    seatId
    userId
    userName
    date
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSeatOccupancyMutationVariables,
  APITypes.UpdateSeatOccupancyMutation
>;
export const deleteSeatOccupancy = /* GraphQL */ `mutation DeleteSeatOccupancy(
  $input: DeleteSeatOccupancyInput!
  $condition: ModelSeatOccupancyConditionInput
) {
  deleteSeatOccupancy(input: $input, condition: $condition) {
    id
    tenantId
    seatId
    userId
    userName
    date
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSeatOccupancyMutationVariables,
  APITypes.DeleteSeatOccupancyMutation
>;
