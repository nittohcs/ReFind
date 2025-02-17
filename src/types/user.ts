
// cognitoから取得するユーザー情報
export type AdminQueriesUser = {
    // cognitoのusername
    id: string,
    email: string,
    name: string,
    tenantId: string,
    // cognitoでユーザーがadminsグループに所属しているかどうか
    isAdmin: boolean,
};

export type ReFindUser = AdminQueriesUser & {
    // 使用中の座席のID。使用中の座席が無いなら空文字
    seatId: string,

    // 使用中の座席の名前。使用中の座席が無いなら空文字
    seatName: string,

    // 使用中の座席があるフロアのid。使用中の座席が無いなら空文字
    floorId: string,

    // 使用中の座席があるフロアの名前。使用中の座席が無いなら空文字
    floorName: string,
};

export type AdminQueriesGroup = "sysAdmins" | "admins" | "users";
