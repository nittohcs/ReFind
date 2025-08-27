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
    sortId
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
    sortId
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
    sortId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.FuncDeleteFloorMutationVariables,
  APITypes.FuncDeleteFloorMutation
>;
export const funcCreateSeat = /* GraphQL */ `mutation FuncCreateSeat($input: funcCreateSeatInput!) {
  funcCreateSeat(input: $input) {
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
  APITypes.FuncCreateSeatMutationVariables,
  APITypes.FuncCreateSeatMutation
>;
export const funcUpdateSeat = /* GraphQL */ `mutation FuncUpdateSeat($input: funcUpdateSeatInput!) {
  funcUpdateSeat(input: $input) {
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
  APITypes.FuncUpdateSeatMutationVariables,
  APITypes.FuncUpdateSeatMutation
>;
export const funcDeleteSeat = /* GraphQL */ `mutation FuncDeleteSeat($input: funcDeleteSeatInput!) {
  funcDeleteSeat(input: $input) {
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
  APITypes.FuncDeleteSeatMutationVariables,
  APITypes.FuncDeleteSeatMutation
>;
export const funcCreateSeatOccupancy = /* GraphQL */ `mutation FuncCreateSeatOccupancy($input: funcCreateSeatOccupancyInput!) {
  funcCreateSeatOccupancy(input: $input) {
    id
    tenantId
    seatId
    userId
    userName
    date
    seatAvailability
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.FuncCreateSeatOccupancyMutationVariables,
  APITypes.FuncCreateSeatOccupancyMutation
>;
export const funcUpdateSeatOccupancy = /* GraphQL */ `mutation FuncUpdateSeatOccupancy($input: funcUpdateSeatOccupancyInput!) {
  funcUpdateSeatOccupancy(input: $input) {
    id
    tenantId
    seatId
    userId
    userName
    date
    seatAvailability
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.FuncUpdateSeatOccupancyMutationVariables,
  APITypes.FuncUpdateSeatOccupancyMutation
>;
export const funcClearSeatOccupanciesByTenantId = /* GraphQL */ `mutation FuncClearSeatOccupanciesByTenantId(
  $input: funcClearSeatOccupanciesByTenantIdInput!
) {
  funcClearSeatOccupanciesByTenantId(input: $input) {
    id
    tenantId
    seatId
    userId
    userName
    date
    seatAvailability
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.FuncClearSeatOccupanciesByTenantIdMutationVariables,
  APITypes.FuncClearSeatOccupanciesByTenantIdMutation
>;
export const funcUpdateUserAttributes = /* GraphQL */ `mutation FuncUpdateUserAttributes($input: funcUpdateUserAttributesInput) {
  funcUpdateUserAttributes(input: $input) {
    isUpdatedEmail
    isUpdatedName
    isRequiredVerification
    updatedUser {
      id
      tenantId
      email
      name
      comment
      commentForegroundColor
      commentBackgroundColor
      isAdmin
      confirmingEmail
      isQRCodeScan
      isOutsideCamera
      createdAt
      updatedAt
      __typename
    }
    __typename
  }
}
` as GeneratedMutation<
  APITypes.FuncUpdateUserAttributesMutationVariables,
  APITypes.FuncUpdateUserAttributesMutation
>;
export const funcVerifyUserAttribute = /* GraphQL */ `mutation FuncVerifyUserAttribute($input: funcVerifyUserAttributeInput) {
  funcVerifyUserAttribute(input: $input)
}
` as GeneratedMutation<
  APITypes.FuncVerifyUserAttributeMutationVariables,
  APITypes.FuncVerifyUserAttributeMutation
>;
export const createTenant = /* GraphQL */ `mutation CreateTenant(
  $input: CreateTenantInput!
  $condition: ModelTenantConditionInput
) {
  createTenant(input: $input, condition: $condition) {
    id
    name
    maxUserCount
    initialPassword
    retentionPeriodDays
    isSuspended
    prefix
    email
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
    maxUserCount
    initialPassword
    retentionPeriodDays
    isSuspended
    prefix
    email
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
    maxUserCount
    initialPassword
    retentionPeriodDays
    isSuspended
    prefix
    email
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTenantMutationVariables,
  APITypes.DeleteTenantMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
    id
    tenantId
    email
    name
    comment
    commentForegroundColor
    commentBackgroundColor
    isAdmin
    confirmingEmail
    isQRCodeScan
    isOutsideCamera
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
    id
    tenantId
    email
    name
    comment
    commentForegroundColor
    commentBackgroundColor
    isAdmin
    confirmingEmail
    isQRCodeScan
    isOutsideCamera
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
    id
    tenantId
    email
    name
    comment
    commentForegroundColor
    commentBackgroundColor
    isAdmin
    confirmingEmail
    isQRCodeScan
    isOutsideCamera
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
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
    sortId
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
    sortId
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
    sortId
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
    seatAvailability
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
    seatAvailability
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
    seatAvailability
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSeatOccupancyMutationVariables,
  APITypes.DeleteSeatOccupancyMutation
>;
