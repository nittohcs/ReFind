/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateFloorInput = {
  id?: string | null,
  tenantId: string,
  name: string,
  imagePath: string,
  imageWidth: number,
  imageHeight: number,
};

export type ModelFloorConditionInput = {
  tenantId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  imagePath?: ModelStringInput | null,
  imageWidth?: ModelIntInput | null,
  imageHeight?: ModelIntInput | null,
  and?: Array< ModelFloorConditionInput | null > | null,
  or?: Array< ModelFloorConditionInput | null > | null,
  not?: ModelFloorConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Floor = {
  __typename: "Floor",
  id: string,
  tenantId: string,
  name: string,
  imagePath: string,
  imageWidth: number,
  imageHeight: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateFloorInput = {
  id: string,
  tenantId?: string | null,
  name?: string | null,
  imagePath?: string | null,
  imageWidth?: number | null,
  imageHeight?: number | null,
};

export type DeleteFloorInput = {
  id: string,
};

export type ModelFloorFilterInput = {
  id?: ModelIDInput | null,
  tenantId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  imagePath?: ModelStringInput | null,
  imageWidth?: ModelIntInput | null,
  imageHeight?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFloorFilterInput | null > | null,
  or?: Array< ModelFloorFilterInput | null > | null,
  not?: ModelFloorFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelFloorConnection = {
  __typename: "ModelFloorConnection",
  items:  Array<Floor | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionFloorFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  imagePath?: ModelSubscriptionStringInput | null,
  imageWidth?: ModelSubscriptionIntInput | null,
  imageHeight?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFloorFilterInput | null > | null,
  or?: Array< ModelSubscriptionFloorFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type CreateFloorMutationVariables = {
  input: CreateFloorInput,
  condition?: ModelFloorConditionInput | null,
};

export type CreateFloorMutation = {
  createFloor?:  {
    __typename: "Floor",
    id: string,
    tenantId: string,
    name: string,
    imagePath: string,
    imageWidth: number,
    imageHeight: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateFloorMutationVariables = {
  input: UpdateFloorInput,
  condition?: ModelFloorConditionInput | null,
};

export type UpdateFloorMutation = {
  updateFloor?:  {
    __typename: "Floor",
    id: string,
    tenantId: string,
    name: string,
    imagePath: string,
    imageWidth: number,
    imageHeight: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteFloorMutationVariables = {
  input: DeleteFloorInput,
  condition?: ModelFloorConditionInput | null,
};

export type DeleteFloorMutation = {
  deleteFloor?:  {
    __typename: "Floor",
    id: string,
    tenantId: string,
    name: string,
    imagePath: string,
    imageWidth: number,
    imageHeight: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetFloorQueryVariables = {
  id: string,
};

export type GetFloorQuery = {
  getFloor?:  {
    __typename: "Floor",
    id: string,
    tenantId: string,
    name: string,
    imagePath: string,
    imageWidth: number,
    imageHeight: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListFloorsQueryVariables = {
  filter?: ModelFloorFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFloorsQuery = {
  listFloors?:  {
    __typename: "ModelFloorConnection",
    items:  Array< {
      __typename: "Floor",
      id: string,
      tenantId: string,
      name: string,
      imagePath: string,
      imageWidth: number,
      imageHeight: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateFloorSubscriptionVariables = {
  filter?: ModelSubscriptionFloorFilterInput | null,
};

export type OnCreateFloorSubscription = {
  onCreateFloor?:  {
    __typename: "Floor",
    id: string,
    tenantId: string,
    name: string,
    imagePath: string,
    imageWidth: number,
    imageHeight: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFloorSubscriptionVariables = {
  filter?: ModelSubscriptionFloorFilterInput | null,
};

export type OnUpdateFloorSubscription = {
  onUpdateFloor?:  {
    __typename: "Floor",
    id: string,
    tenantId: string,
    name: string,
    imagePath: string,
    imageWidth: number,
    imageHeight: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFloorSubscriptionVariables = {
  filter?: ModelSubscriptionFloorFilterInput | null,
};

export type OnDeleteFloorSubscription = {
  onDeleteFloor?:  {
    __typename: "Floor",
    id: string,
    tenantId: string,
    name: string,
    imagePath: string,
    imageWidth: number,
    imageHeight: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};
