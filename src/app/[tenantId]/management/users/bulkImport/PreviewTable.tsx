"use client";

import { FC, useMemo } from "react";
import { useField } from "formik";
import { createColumnHelper } from "@tanstack/react-table";
import { CreateUserInput } from "@/API";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalTable from "@/components/MiraCalTable";
import { useTable, useTableOption } from "@/hooks/table";
import { getCreateUserInputsFromCsv } from "./util";

const columnHelper = createColumnHelper<CreateUserInput>();

type PreviewTableProps = {
    name: string,
};

export const PreviewTable: FC<PreviewTableProps> = ({ name }) => {
    const tenantId = useTenantId();
    const [field, _meta, _helper] = useField<string>(name);

    const users = useMemo(() => getCreateUserInputsFromCsv(field.value, tenantId), [field.value, tenantId]);

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
        columnHelper.accessor("comment", {
            header: "コメント",
        }),
        columnHelper.accessor("isAdmin", {
            header: "管理者",
        }),
    ], []);

    const options = useTableOption<CreateUserInput>({
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
