"use client";

import { fetchAuthSession } from "aws-amplify/auth";
import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { FuncUpdateUserAttributesMutation, FuncUpdateUserAttributesMutationVariables, FuncVerifyUserAttributeMutation, FuncVerifyUserAttributeMutationVariables } from "@/API";
import { client } from "@/components/APIClientProvider";
import { funcUpdateUserAttributes, funcVerifyUserAttribute } from "@/graphql/mutations";

type UpdateUserAttributesInput = {
    email?: string,
    name?: string,
    comment?: string,
    commentForegroundColor?: string,
    commentBackgroundColor?: string,
};

export async function graphqlUpdateUserAttributes(updateInput: UpdateUserAttributesInput) {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const input = {
        ...updateInput,
        accessToken,
    };
    const result = await client.graphql(
        graphqlOperation(
            funcUpdateUserAttributes,
            {
                input,
            } as FuncUpdateUserAttributesMutationVariables
        )
    ) as GraphQLResult<FuncUpdateUserAttributesMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.funcUpdateUserAttributes) { throw new Error("ユーザー情報の更新に失敗しました。"); }
    return result.data.funcUpdateUserAttributes;
}

export async function graphqlVerifyUserAttribute(attributeName: string, code: string) {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const input = {
        accessToken,
        attributeName,
        code,
    };
    const result = await client.graphql(
        graphqlOperation(
            funcVerifyUserAttribute,
            {
                input,
            } as FuncVerifyUserAttributeMutationVariables
        )
    ) as GraphQLResult<FuncVerifyUserAttributeMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.funcVerifyUserAttribute) { throw new Error("検証に失敗しました。"); }
    return result.data.funcVerifyUserAttribute;
}
