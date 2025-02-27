
import { User } from "@/API";

export type ReFindUser = User & {
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
