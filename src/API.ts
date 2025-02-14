/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type funcCreateFloorInput = {
  id?: string | null,
  tenantId: string,
  name: string,
  imagePath: string,
  imageWidth: number,
  imageHeight: number,
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

export type funcUpdateFloorInput = {
  id: string,
  tenantId?: string | null,
  name?: string | null,
  imagePath?: string | null,
  imageWidth?: number | null,
  imageHeight?: number | null,
};

export type funcDeleteFloorInput = {
  id: string,
};

export type funcCreateSeatInput = {
  id?: string | null,
  tenantId: string,
  floorId: string,
  name: string,
  posX: number,
  posY: number,
};

export type Seat = {
  __typename: "Seat",
  id: string,
  tenantId: string,
  floorId: string,
  name: string,
  posX: number,
  posY: number,
  createdAt: string,
  updatedAt: string,
};

export type funcUpdateSeatInput = {
  id: string,
  tenantId?: string | null,
  floorId?: string | null,
  name?: string | null,
  posX?: number | null,
  posY?: number | null,
};

export type funcDeleteSeatInput = {
  id: string,
};

export type funcCreateSeatOccupancyInput = {
  id?: string | null,
  tenantId: string,
  seatId: string,
  userId?: string | null,
  userName?: string | null,
  date: string,
};

export type SeatOccupancy = {
  __typename: "SeatOccupancy",
  id: string,
  tenantId: string,
  seatId: string,
  userId?: string | null,
  userName?: string | null,
  date: string,
  createdAt: string,
  updatedAt: string,
};

export type funcUpdateUserAttributesInput = {
  accessToken: string,
  email?: string | null,
  name?: string | null,
};

export type funcUpdateUserAttributesResponse = {
  __typename: "funcUpdateUserAttributesResponse",
  isUpdatedEmail: boolean,
  isUpdatedName: boolean,
  isRequiredVerification: boolean,
};

export type funcVerifyUserAttributeInput = {
  accessToken: string,
  attributeName: string,
  code: string,
};

export type CreateTenantInput = {
  id?: string | null,
  name: string,
  isSuspended: boolean,
};

export type ModelTenantConditionInput = {
  name?: ModelStringInput | null,
  isSuspended?: ModelBooleanInput | null,
  and?: Array< ModelTenantConditionInput | null > | null,
  or?: Array< ModelTenantConditionInput | null > | null,
  not?: ModelTenantConditionInput | null,
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

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Tenant = {
  __typename: "Tenant",
  id: string,
  name: string,
  isSuspended: boolean,
  createdAt: string,
  updatedAt: string,
};

export type UpdateTenantInput = {
  id: string,
  name?: string | null,
  isSuspended?: boolean | null,
};

export type DeleteTenantInput = {
  id: string,
};

export type CreateUserInput = {
  id?: string | null,
  tenantId: string,
  email: string,
  name: string,
  isAdmin: boolean,
  confirmingEmail?: string | null,
};

export type ModelUserConditionInput = {
  tenantId?: ModelIDInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  isAdmin?: ModelBooleanInput | null,
  confirmingEmail?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
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

export type User = {
  __typename: "User",
  id: string,
  tenantId: string,
  email: string,
  name: string,
  isAdmin: boolean,
  confirmingEmail?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateUserInput = {
  id: string,
  tenantId?: string | null,
  email?: string | null,
  name?: string | null,
  isAdmin?: boolean | null,
  confirmingEmail?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateFloorInput = {
  id?: string | null,
  tenantId: string,
  name: string,
  imagePath: string,
  imageWidth: number,
  imageHeight: number,
};

export type ModelFloorConditionInput = {
  tenantId?: ModelIDInput | null,
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

export type CreateSeatInput = {
  id?: string | null,
  tenantId: string,
  floorId: string,
  name: string,
  posX: number,
  posY: number,
};

export type ModelSeatConditionInput = {
  tenantId?: ModelIDInput | null,
  floorId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  posX?: ModelIntInput | null,
  posY?: ModelIntInput | null,
  and?: Array< ModelSeatConditionInput | null > | null,
  or?: Array< ModelSeatConditionInput | null > | null,
  not?: ModelSeatConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateSeatInput = {
  id: string,
  tenantId?: string | null,
  floorId?: string | null,
  name?: string | null,
  posX?: number | null,
  posY?: number | null,
};

export type DeleteSeatInput = {
  id: string,
};

export type CreateSeatOccupancyInput = {
  id?: string | null,
  tenantId: string,
  seatId: string,
  userId?: string | null,
  userName?: string | null,
  date: string,
};

export type ModelSeatOccupancyConditionInput = {
  tenantId?: ModelIDInput | null,
  seatId?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  userName?: ModelStringInput | null,
  date?: ModelStringInput | null,
  and?: Array< ModelSeatOccupancyConditionInput | null > | null,
  or?: Array< ModelSeatOccupancyConditionInput | null > | null,
  not?: ModelSeatOccupancyConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateSeatOccupancyInput = {
  id: string,
  tenantId?: string | null,
  seatId?: string | null,
  userId?: string | null,
  userName?: string | null,
  date?: string | null,
};

export type DeleteSeatOccupancyInput = {
  id: string,
};

export type ModelTenantFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  isSuspended?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelTenantFilterInput | null > | null,
  or?: Array< ModelTenantFilterInput | null > | null,
  not?: ModelTenantFilterInput | null,
};

export type ModelTenantConnection = {
  __typename: "ModelTenantConnection",
  items:  Array<Tenant | null >,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  tenantId?: ModelIDInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  isAdmin?: ModelBooleanInput | null,
  confirmingEmail?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelFloorFilterInput = {
  id?: ModelIDInput | null,
  tenantId?: ModelIDInput | null,
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

export type ModelFloorConnection = {
  __typename: "ModelFloorConnection",
  items:  Array<Floor | null >,
  nextToken?: string | null,
};

export type ModelSeatFilterInput = {
  id?: ModelIDInput | null,
  tenantId?: ModelIDInput | null,
  floorId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  posX?: ModelIntInput | null,
  posY?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelSeatFilterInput | null > | null,
  or?: Array< ModelSeatFilterInput | null > | null,
  not?: ModelSeatFilterInput | null,
};

export type ModelSeatConnection = {
  __typename: "ModelSeatConnection",
  items:  Array<Seat | null >,
  nextToken?: string | null,
};

export type ModelSeatOccupancyFilterInput = {
  id?: ModelIDInput | null,
  tenantId?: ModelIDInput | null,
  seatId?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  userName?: ModelStringInput | null,
  date?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelSeatOccupancyFilterInput | null > | null,
  or?: Array< ModelSeatOccupancyFilterInput | null > | null,
  not?: ModelSeatOccupancyFilterInput | null,
};

export type ModelSeatOccupancyConnection = {
  __typename: "ModelSeatOccupancyConnection",
  items:  Array<SeatOccupancy | null >,
  nextToken?: string | null,
};

export type ModelIDKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelSubscriptionTenantFilterInput = {
  name?: ModelSubscriptionStringInput | null,
  isSuspended?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTenantFilterInput | null > | null,
  or?: Array< ModelSubscriptionTenantFilterInput | null > | null,
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

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  email?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  isAdmin?: ModelSubscriptionBooleanInput | null,
  confirmingEmail?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
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

export type ModelSubscriptionSeatFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  floorId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  posX?: ModelSubscriptionIntInput | null,
  posY?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionSeatFilterInput | null > | null,
  or?: Array< ModelSubscriptionSeatFilterInput | null > | null,
};

export type ModelSubscriptionSeatOccupancyFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  seatId?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  userName?: ModelSubscriptionStringInput | null,
  date?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionSeatOccupancyFilterInput | null > | null,
  or?: Array< ModelSubscriptionSeatOccupancyFilterInput | null > | null,
};

export type DeleteFileMutationVariables = {
  filePath: string,
};

export type DeleteFileMutation = {
  deleteFile?: boolean | null,
};

export type FuncCreateFloorMutationVariables = {
  input: funcCreateFloorInput,
};

export type FuncCreateFloorMutation = {
  funcCreateFloor?:  {
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

export type FuncUpdateFloorMutationVariables = {
  input: funcUpdateFloorInput,
};

export type FuncUpdateFloorMutation = {
  funcUpdateFloor?:  {
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

export type FuncDeleteFloorMutationVariables = {
  input: funcDeleteFloorInput,
};

export type FuncDeleteFloorMutation = {
  funcDeleteFloor?:  {
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

export type FuncCreateSeatMutationVariables = {
  input: funcCreateSeatInput,
};

export type FuncCreateSeatMutation = {
  funcCreateSeat?:  {
    __typename: "Seat",
    id: string,
    tenantId: string,
    floorId: string,
    name: string,
    posX: number,
    posY: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type FuncUpdateSeatMutationVariables = {
  input: funcUpdateSeatInput,
};

export type FuncUpdateSeatMutation = {
  funcUpdateSeat?:  {
    __typename: "Seat",
    id: string,
    tenantId: string,
    floorId: string,
    name: string,
    posX: number,
    posY: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type FuncDeleteSeatMutationVariables = {
  input: funcDeleteSeatInput,
};

export type FuncDeleteSeatMutation = {
  funcDeleteSeat?:  {
    __typename: "Seat",
    id: string,
    tenantId: string,
    floorId: string,
    name: string,
    posX: number,
    posY: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type FuncCreateSeatOccupancyMutationVariables = {
  input: funcCreateSeatOccupancyInput,
};

export type FuncCreateSeatOccupancyMutation = {
  funcCreateSeatOccupancy?:  {
    __typename: "SeatOccupancy",
    id: string,
    tenantId: string,
    seatId: string,
    userId?: string | null,
    userName?: string | null,
    date: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type FuncUpdateUserAttributesMutationVariables = {
  input?: funcUpdateUserAttributesInput | null,
};

export type FuncUpdateUserAttributesMutation = {
  funcUpdateUserAttributes?:  {
    __typename: "funcUpdateUserAttributesResponse",
    isUpdatedEmail: boolean,
    isUpdatedName: boolean,
    isRequiredVerification: boolean,
  } | null,
};

export type FuncVerifyUserAttributeMutationVariables = {
  input?: funcVerifyUserAttributeInput | null,
};

export type FuncVerifyUserAttributeMutation = {
  funcVerifyUserAttribute?: boolean | null,
};

export type CreateTenantMutationVariables = {
  input: CreateTenantInput,
  condition?: ModelTenantConditionInput | null,
};

export type CreateTenantMutation = {
  createTenant?:  {
    __typename: "Tenant",
    id: string,
    name: string,
    isSuspended: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTenantMutationVariables = {
  input: UpdateTenantInput,
  condition?: ModelTenantConditionInput | null,
};

export type UpdateTenantMutation = {
  updateTenant?:  {
    __typename: "Tenant",
    id: string,
    name: string,
    isSuspended: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTenantMutationVariables = {
  input: DeleteTenantInput,
  condition?: ModelTenantConditionInput | null,
};

export type DeleteTenantMutation = {
  deleteTenant?:  {
    __typename: "Tenant",
    id: string,
    name: string,
    isSuspended: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    tenantId: string,
    email: string,
    name: string,
    isAdmin: boolean,
    confirmingEmail?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    tenantId: string,
    email: string,
    name: string,
    isAdmin: boolean,
    confirmingEmail?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    tenantId: string,
    email: string,
    name: string,
    isAdmin: boolean,
    confirmingEmail?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
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

export type CreateSeatMutationVariables = {
  input: CreateSeatInput,
  condition?: ModelSeatConditionInput | null,
};

export type CreateSeatMutation = {
  createSeat?:  {
    __typename: "Seat",
    id: string,
    tenantId: string,
    floorId: string,
    name: string,
    posX: number,
    posY: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateSeatMutationVariables = {
  input: UpdateSeatInput,
  condition?: ModelSeatConditionInput | null,
};

export type UpdateSeatMutation = {
  updateSeat?:  {
    __typename: "Seat",
    id: string,
    tenantId: string,
    floorId: string,
    name: string,
    posX: number,
    posY: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteSeatMutationVariables = {
  input: DeleteSeatInput,
  condition?: ModelSeatConditionInput | null,
};

export type DeleteSeatMutation = {
  deleteSeat?:  {
    __typename: "Seat",
    id: string,
    tenantId: string,
    floorId: string,
    name: string,
    posX: number,
    posY: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateSeatOccupancyMutationVariables = {
  input: CreateSeatOccupancyInput,
  condition?: ModelSeatOccupancyConditionInput | null,
};

export type CreateSeatOccupancyMutation = {
  createSeatOccupancy?:  {
    __typename: "SeatOccupancy",
    id: string,
    tenantId: string,
    seatId: string,
    userId?: string | null,
    userName?: string | null,
    date: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateSeatOccupancyMutationVariables = {
  input: UpdateSeatOccupancyInput,
  condition?: ModelSeatOccupancyConditionInput | null,
};

export type UpdateSeatOccupancyMutation = {
  updateSeatOccupancy?:  {
    __typename: "SeatOccupancy",
    id: string,
    tenantId: string,
    seatId: string,
    userId?: string | null,
    userName?: string | null,
    date: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteSeatOccupancyMutationVariables = {
  input: DeleteSeatOccupancyInput,
  condition?: ModelSeatOccupancyConditionInput | null,
};

export type DeleteSeatOccupancyMutation = {
  deleteSeatOccupancy?:  {
    __typename: "SeatOccupancy",
    id: string,
    tenantId: string,
    seatId: string,
    userId?: string | null,
    userName?: string | null,
    date: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetFileUploadUrlQueryVariables = {
  filePath: string,
};

export type GetFileUploadUrlQuery = {
  getFileUploadUrl?: string | null,
};

export type GetFileDownloadUrlQueryVariables = {
  filePath: string,
  expiresIn?: number | null,
};

export type GetFileDownloadUrlQuery = {
  getFileDownloadUrl?: string | null,
};

export type GetTenantQueryVariables = {
  id: string,
};

export type GetTenantQuery = {
  getTenant?:  {
    __typename: "Tenant",
    id: string,
    name: string,
    isSuspended: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTenantsQueryVariables = {
  filter?: ModelTenantFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTenantsQuery = {
  listTenants?:  {
    __typename: "ModelTenantConnection",
    items:  Array< {
      __typename: "Tenant",
      id: string,
      name: string,
      isSuspended: boolean,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    tenantId: string,
    email: string,
    name: string,
    isAdmin: boolean,
    confirmingEmail?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      tenantId: string,
      email: string,
      name: string,
      isAdmin: boolean,
      confirmingEmail?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByTenantIdQueryVariables = {
  tenantId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByTenantIdQuery = {
  usersByTenantId?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      tenantId: string,
      email: string,
      name: string,
      isAdmin: boolean,
      confirmingEmail?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
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

export type FloorsByTenantIdQueryVariables = {
  tenantId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFloorFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FloorsByTenantIdQuery = {
  floorsByTenantId?:  {
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

export type GetSeatQueryVariables = {
  id: string,
};

export type GetSeatQuery = {
  getSeat?:  {
    __typename: "Seat",
    id: string,
    tenantId: string,
    floorId: string,
    name: string,
    posX: number,
    posY: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListSeatsQueryVariables = {
  filter?: ModelSeatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSeatsQuery = {
  listSeats?:  {
    __typename: "ModelSeatConnection",
    items:  Array< {
      __typename: "Seat",
      id: string,
      tenantId: string,
      floorId: string,
      name: string,
      posX: number,
      posY: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SeatsByTenantIdQueryVariables = {
  tenantId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSeatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SeatsByTenantIdQuery = {
  seatsByTenantId?:  {
    __typename: "ModelSeatConnection",
    items:  Array< {
      __typename: "Seat",
      id: string,
      tenantId: string,
      floorId: string,
      name: string,
      posX: number,
      posY: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetSeatOccupancyQueryVariables = {
  id: string,
};

export type GetSeatOccupancyQuery = {
  getSeatOccupancy?:  {
    __typename: "SeatOccupancy",
    id: string,
    tenantId: string,
    seatId: string,
    userId?: string | null,
    userName?: string | null,
    date: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListSeatOccupanciesQueryVariables = {
  filter?: ModelSeatOccupancyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSeatOccupanciesQuery = {
  listSeatOccupancies?:  {
    __typename: "ModelSeatOccupancyConnection",
    items:  Array< {
      __typename: "SeatOccupancy",
      id: string,
      tenantId: string,
      seatId: string,
      userId?: string | null,
      userName?: string | null,
      date: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SeatOccupanciesByTenantIdQueryVariables = {
  tenantId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSeatOccupancyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SeatOccupanciesByTenantIdQuery = {
  seatOccupanciesByTenantId?:  {
    __typename: "ModelSeatOccupancyConnection",
    items:  Array< {
      __typename: "SeatOccupancy",
      id: string,
      tenantId: string,
      seatId: string,
      userId?: string | null,
      userName?: string | null,
      date: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SeatOccupanciesByDateAndTenantIdQueryVariables = {
  date: string,
  tenantId?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSeatOccupancyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SeatOccupanciesByDateAndTenantIdQuery = {
  seatOccupanciesByDateAndTenantId?:  {
    __typename: "ModelSeatOccupancyConnection",
    items:  Array< {
      __typename: "SeatOccupancy",
      id: string,
      tenantId: string,
      seatId: string,
      userId?: string | null,
      userName?: string | null,
      date: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateSeatOccupancyByTenantIdSubscriptionVariables = {
  tenantId: string,
};

export type OnCreateSeatOccupancyByTenantIdSubscription = {
  onCreateSeatOccupancyByTenantId?:  {
    __typename: "SeatOccupancy",
    id: string,
    tenantId: string,
    seatId: string,
    userId?: string | null,
    userName?: string | null,
    date: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTenantSubscriptionVariables = {
  filter?: ModelSubscriptionTenantFilterInput | null,
};

export type OnCreateTenantSubscription = {
  onCreateTenant?:  {
    __typename: "Tenant",
    id: string,
    name: string,
    isSuspended: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTenantSubscriptionVariables = {
  filter?: ModelSubscriptionTenantFilterInput | null,
};

export type OnUpdateTenantSubscription = {
  onUpdateTenant?:  {
    __typename: "Tenant",
    id: string,
    name: string,
    isSuspended: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTenantSubscriptionVariables = {
  filter?: ModelSubscriptionTenantFilterInput | null,
};

export type OnDeleteTenantSubscription = {
  onDeleteTenant?:  {
    __typename: "Tenant",
    id: string,
    name: string,
    isSuspended: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    tenantId: string,
    email: string,
    name: string,
    isAdmin: boolean,
    confirmingEmail?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    tenantId: string,
    email: string,
    name: string,
    isAdmin: boolean,
    confirmingEmail?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    tenantId: string,
    email: string,
    name: string,
    isAdmin: boolean,
    confirmingEmail?: string | null,
    createdAt: string,
    updatedAt: string,
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

export type OnCreateSeatSubscriptionVariables = {
  filter?: ModelSubscriptionSeatFilterInput | null,
};

export type OnCreateSeatSubscription = {
  onCreateSeat?:  {
    __typename: "Seat",
    id: string,
    tenantId: string,
    floorId: string,
    name: string,
    posX: number,
    posY: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateSeatSubscriptionVariables = {
  filter?: ModelSubscriptionSeatFilterInput | null,
};

export type OnUpdateSeatSubscription = {
  onUpdateSeat?:  {
    __typename: "Seat",
    id: string,
    tenantId: string,
    floorId: string,
    name: string,
    posX: number,
    posY: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteSeatSubscriptionVariables = {
  filter?: ModelSubscriptionSeatFilterInput | null,
};

export type OnDeleteSeatSubscription = {
  onDeleteSeat?:  {
    __typename: "Seat",
    id: string,
    tenantId: string,
    floorId: string,
    name: string,
    posX: number,
    posY: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateSeatOccupancySubscriptionVariables = {
  filter?: ModelSubscriptionSeatOccupancyFilterInput | null,
};

export type OnCreateSeatOccupancySubscription = {
  onCreateSeatOccupancy?:  {
    __typename: "SeatOccupancy",
    id: string,
    tenantId: string,
    seatId: string,
    userId?: string | null,
    userName?: string | null,
    date: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateSeatOccupancySubscriptionVariables = {
  filter?: ModelSubscriptionSeatOccupancyFilterInput | null,
};

export type OnUpdateSeatOccupancySubscription = {
  onUpdateSeatOccupancy?:  {
    __typename: "SeatOccupancy",
    id: string,
    tenantId: string,
    seatId: string,
    userId?: string | null,
    userName?: string | null,
    date: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteSeatOccupancySubscriptionVariables = {
  filter?: ModelSubscriptionSeatOccupancyFilterInput | null,
};

export type OnDeleteSeatOccupancySubscription = {
  onDeleteSeatOccupancy?:  {
    __typename: "SeatOccupancy",
    id: string,
    tenantId: string,
    seatId: string,
    userId?: string | null,
    userName?: string | null,
    date: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
