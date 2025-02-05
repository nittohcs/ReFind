/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getFloor = /* GraphQL */ `query GetFloor($id: ID!) {
  getFloor(id: $id) {
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
