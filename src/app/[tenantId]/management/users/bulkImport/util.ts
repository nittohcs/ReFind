"use client";

import { parse } from "csv-parse/sync";
import { ReFindUser } from "@/types/user";

export function getReFindUsersFromCsv(csv: string, tenantId: string) {
    const users: ReFindUser[] = [];

    try {
        const rows: { [key: string]: string | undefined }[] = parse(csv, {
            columns: true,
            skip_empty_lines: true,
            relax_column_count:true,
        });

        for(const row of rows) {
            const user: ReFindUser = {
                id: row["ID"] ?? "",
                name: row["氏名"] ?? "",
                email: row["メールアドレス"] ?? "",
                tenantId: tenantId,
                isAdmin: !!row["管理者"]?.trim(),
                seatId: "",
                seatName: "",
                floorId: "",
                floorName: "",
            };
            users.push(user);
        }
    } catch (error) {
        console.log(error);
    }

    return users;
}

// yupのemail()と同じチェックになるよう、次のURLのrEmailの値を使用している
// https://github.com/jquense/yup/blob/master/src/string.ts
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isValidEmail(email: string) {
    return emailRegex.test(email);
}
