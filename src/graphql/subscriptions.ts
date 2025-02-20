/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateSeatOccupancyByTenantId = /* GraphQL */ `subscription OnCreateSeatOccupancyByTenantId($tenantId: String!) {
  onCreateSeatOccupancyByTenantId(tenantId: $tenantId) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSeatOccupancyByTenantIdSubscriptionVariables,
  APITypes.OnCreateSeatOccupancyByTenantIdSubscription
>;
export const onCreateTenant = /* GraphQL */ `subscription OnCreateTenant($filter: ModelSubscriptionTenantFilterInput) {
  onCreateTenant(filter: $filter) {
    id
    name
    maxUserCount
    initialPassword
    retentionPeriodDays
    isSuspended
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTenantSubscriptionVariables,
  APITypes.OnCreateTenantSubscription
>;
export const onUpdateTenant = /* GraphQL */ `subscription OnUpdateTenant($filter: ModelSubscriptionTenantFilterInput) {
  onUpdateTenant(filter: $filter) {
    id
    name
    maxUserCount
    initialPassword
    retentionPeriodDays
    isSuspended
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTenantSubscriptionVariables,
  APITypes.OnUpdateTenantSubscription
>;
export const onDeleteTenant = /* GraphQL */ `subscription OnDeleteTenant($filter: ModelSubscriptionTenantFilterInput) {
  onDeleteTenant(filter: $filter) {
    id
    name
    maxUserCount
    initialPassword
    retentionPeriodDays
    isSuspended
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTenantSubscriptionVariables,
  APITypes.OnDeleteTenantSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
    id
    tenantId
    email
    name
    isAdmin
    confirmingEmail
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
    id
    tenantId
    email
    name
    isAdmin
    confirmingEmail
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
    id
    tenantId
    email
    name
    isAdmin
    confirmingEmail
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
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
export const onCreateSeat = /* GraphQL */ `subscription OnCreateSeat($filter: ModelSubscriptionSeatFilterInput) {
  onCreateSeat(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSeatSubscriptionVariables,
  APITypes.OnCreateSeatSubscription
>;
export const onUpdateSeat = /* GraphQL */ `subscription OnUpdateSeat($filter: ModelSubscriptionSeatFilterInput) {
  onUpdateSeat(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSeatSubscriptionVariables,
  APITypes.OnUpdateSeatSubscription
>;
export const onDeleteSeat = /* GraphQL */ `subscription OnDeleteSeat($filter: ModelSubscriptionSeatFilterInput) {
  onDeleteSeat(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSeatSubscriptionVariables,
  APITypes.OnDeleteSeatSubscription
>;
export const onCreateSeatOccupancy = /* GraphQL */ `subscription OnCreateSeatOccupancy(
  $filter: ModelSubscriptionSeatOccupancyFilterInput
) {
  onCreateSeatOccupancy(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSeatOccupancySubscriptionVariables,
  APITypes.OnCreateSeatOccupancySubscription
>;
export const onUpdateSeatOccupancy = /* GraphQL */ `subscription OnUpdateSeatOccupancy(
  $filter: ModelSubscriptionSeatOccupancyFilterInput
) {
  onUpdateSeatOccupancy(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSeatOccupancySubscriptionVariables,
  APITypes.OnUpdateSeatOccupancySubscription
>;
export const onDeleteSeatOccupancy = /* GraphQL */ `subscription OnDeleteSeatOccupancy(
  $filter: ModelSubscriptionSeatOccupancyFilterInput
) {
  onDeleteSeatOccupancy(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSeatOccupancySubscriptionVariables,
  APITypes.OnDeleteSeatOccupancySubscription
>;
