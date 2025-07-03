"use client";

import { parse } from "csv-parse/sync";
import { CreateUserInput } from "@/API";

export function getCreateUserInputsFromCsv(csv: string, tenantId: string) {
    const ret = [];

    try {
        const rows: { [key: string]: string | undefined }[] = parse(csv, {
            columns: true,
            skip_empty_lines: true,
            relax_column_count:true,
        });

        for(const row of rows) {
            const user: CreateUserInput = {
                id: row["ID"] ?? row["id"] ??  "",
                name: row["氏名"] ?? row["name"] ?? "",
                email: row["メールアドレス"] ?? "",
                comment: row["コメント"] ?? row["comment"] ?? "",
                tenantId: tenantId,
                isAdmin: !!row["管理者"]?.trim() ? !!row["管理者"] : !!row["isAdminString"]?.trim(),
            };
            ret.push(user);
        }
    } catch (error) {
        console.log(error);
    }

    return ret;
}

// yupのemail()と同じチェックになるよう、次のURLのrEmailの値を使用している
// https://github.com/jquense/yup/blob/master/src/string.ts
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isValidEmail(email: string) {
    return emailRegex.test(email);
}
