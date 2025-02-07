"use client";

import { FC, useMemo } from "react";
import { useField } from "formik";
import { createColumnHelper } from "@tanstack/react-table";
import MiraCalTable from "@/components/MiraCalTable";
import { useTable, useTableOption } from "@/hooks/table";
import { ReFindUser } from "@/types/user";
import { getReFindUsersFromCsv } from "./util";

const columnHelper = createColumnHelper<ReFindUser>();

type PreviewTableProps = {
    name: string,
};

export const PreviewTable: FC<PreviewTableProps> = ({ name }) => {
    const [field, _meta, _helper] = useField<string>(name);

    const users = useMemo(() => getReFindUsersFromCsv(field.value), [field.value]);

    const columns = useMemo(() => [
        columnHelper.accessor("id", {
            id: "id",
            header: "ID",
        }),
        columnHelper.accessor("name", {
            header: "氏名",
        }),
        columnHelper.accessor("email", {
            header: "メールアドレス",
        }),
        columnHelper.accessor("isAdmin", {
            header: "管理者",
        }),
    ], []);

    const options = useTableOption<ReFindUser>({
        // sorting: [{
        //     id: "id",
        //     desc: false,
        // }],
    });

    const table = useTable({ data: users, columns, options });

    return (
        <MiraCalTable
            table={table}
        />
    );
};
export default PreviewTable;
