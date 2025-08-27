/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getFileUploadUrl = /* GraphQL */ `query GetFileUploadUrl($filePath: String!) {
  getFileUploadUrl(filePath: $filePath)
}
` as GeneratedQuery<
  APITypes.GetFileUploadUrlQueryVariables,
  APITypes.GetFileUploadUrlQuery
>;
export const getFileDownloadUrl = /* GraphQL */ `query GetFileDownloadUrl($filePath: String!, $expiresIn: Int) {
  getFileDownloadUrl(filePath: $filePath, expiresIn: $expiresIn)
}
` as GeneratedQuery<
  APITypes.GetFileDownloadUrlQueryVariables,
  APITypes.GetFileDownloadUrlQuery
>;
export const getTenant = /* GraphQL */ `query GetTenant($id: ID!) {
  getTenant(id: $id) {
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
` as GeneratedQuery<APITypes.GetTenantQueryVariables, APITypes.GetTenantQuery>;
export const listTenants = /* GraphQL */ `query ListTenants(
  $filter: ModelTenantFilterInput
  $limit: Int
  $nextToken: String
) {
  listTenants(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTenantsQueryVariables,
  APITypes.ListTenantsQuery
>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const usersByTenantId = /* GraphQL */ `query UsersByTenantId(
  $tenantId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  usersByTenantId(
    tenantId: $tenantId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UsersByTenantIdQueryVariables,
  APITypes.UsersByTenantIdQuery
>;
export const getFloor = /* GraphQL */ `query GetFloor($id: ID!) {
  getFloor(id: $id) {
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
` as GeneratedQuery<APITypes.GetFloorQueryVariables, APITypes.GetFloorQuery>;
export const listFloors = /* GraphQL */ `query ListFloors(
  $filter: ModelFloorFilterInput
  $limit: Int
  $nextToken: String
) {
  listFloors(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFloorsQueryVariables,
  APITypes.ListFloorsQuery
>;
export const floorsByTenantId = /* GraphQL */ `query FloorsByTenantId(
  $tenantId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelFloorFilterInput
  $limit: Int
  $nextToken: String
) {
  floorsByTenantId(
    tenantId: $tenantId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FloorsByTenantIdQueryVariables,
  APITypes.FloorsByTenantIdQuery
>;
export const getSeat = /* GraphQL */ `query GetSeat($id: ID!) {
  getSeat(id: $id) {
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
` as GeneratedQuery<APITypes.GetSeatQueryVariables, APITypes.GetSeatQuery>;
export const listSeats = /* GraphQL */ `query ListSeats(
  $filter: ModelSeatFilterInput
  $limit: Int
  $nextToken: String
) {
  listSeats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListSeatsQueryVariables, APITypes.ListSeatsQuery>;
export const seatsByTenantId = /* GraphQL */ `query SeatsByTenantId(
  $tenantId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelSeatFilterInput
  $limit: Int
  $nextToken: String
) {
  seatsByTenantId(
    tenantId: $tenantId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SeatsByTenantIdQueryVariables,
  APITypes.SeatsByTenantIdQuery
>;
export const getSeatOccupancy = /* GraphQL */ `query GetSeatOccupancy($id: ID!) {
  getSeatOccupancy(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetSeatOccupancyQueryVariables,
  APITypes.GetSeatOccupancyQuery
>;
export const listSeatOccupancies = /* GraphQL */ `query ListSeatOccupancies(
  $filter: ModelSeatOccupancyFilterInput
  $limit: Int
  $nextToken: String
) {
  listSeatOccupancies(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSeatOccupanciesQueryVariables,
  APITypes.ListSeatOccupanciesQuery
>;
export const seatOccupanciesByTenantId = /* GraphQL */ `query SeatOccupanciesByTenantId(
  $tenantId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelSeatOccupancyFilterInput
  $limit: Int
  $nextToken: String
) {
  seatOccupanciesByTenantId(
    tenantId: $tenantId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SeatOccupanciesByTenantIdQueryVariables,
  APITypes.SeatOccupanciesByTenantIdQuery
>;
export const seatOccupanciesByDateAndTenantId = /* GraphQL */ `query SeatOccupanciesByDateAndTenantId(
  $date: String!
  $tenantId: ModelIDKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelSeatOccupancyFilterInput
  $limit: Int
  $nextToken: String
) {
  seatOccupanciesByDateAndTenantId(
    date: $date
    tenantId: $tenantId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SeatOccupanciesByDateAndTenantIdQueryVariables,
  APITypes.SeatOccupanciesByDateAndTenantIdQuery
>;
