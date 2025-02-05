
// cognitoから取得するユーザー情報
export type AdminQueriesUser = {
    // cognitoのusername
    id: string,
    email: string,
    name: string,
};

export type ReFindUser = AdminQueriesUser & {
    // cognitoでユーザーがadminsグループに所属しているかどうか
    isAdmin: boolean,

    // 使用中の座席のID。使用中の座席が無いなら空文字
    seatId: string,

    // 使用中の座席の名前。使用中の座席が無いなら空文字
    seatName: string,

    // 使用中の座席があるフロアのid。使用中の座席が無いなら空文字
    floorId: string,

    // 使用中の座席があるフロアの名前。使用中の座席が無いなら空文字
    floorName: string,

    // TODO graphqlで追加のユーザー情報を格納するテーブルがあるなら、そこから取ってきた項目を追加する
};

export type AdminQueriesGroup = "sysAdmins" | "admins" | "users";
