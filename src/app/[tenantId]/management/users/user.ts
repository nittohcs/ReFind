"use client";

import { SeatOccupancy } from "@/API";
import { addUserToGroup, createUser, deleteUser } from "@/services/AdminQueries";
import { releaseSeatBySeatId } from "@/services/occupancyUtil";
import { ReFindUser } from "@/types/user";

export async function createReFindUser(user: ReFindUser) {
    // TODO ユーザー作成時にcognitoがメールを送るようにしているが、自前でメールを送るようにするかも
    // cognitoユーザー作成
    await createUser(user);

    try {
        // cognitoのグループに追加
        await addUserToGroup(user, user.isAdmin ? "admins" : "users");

        return user;
    } catch (err) {
        // cognitoユーザー作成後にエラー発生したらユーザーを削除する
        await deleteUser(user);

        throw err;
    }
}

export async function deleteReFindUser(user: ReFindUser) {
    let seatOccupancy: SeatOccupancy | null = null;

    // 使用中の座席がある場合、座席を解放
    if (user.seatId) {
        seatOccupancy = await releaseSeatBySeatId(user.tenantId, user.seatId);
    }

    // cognitoのユーザーを削除
    await deleteUser(user);

    return {
        user,
        seatOccupancy,
    };
}
