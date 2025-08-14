import { Checkbox } from "@mui/material";
import { ColumnDefTemplate, HeaderContext } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MiraCalSelectCheckboxHeader: ColumnDefTemplate<HeaderContext<any, any>> = ({ table }) => {
    const disabled = table.getRowModel().rows.length <= 0;
    return (
        <Checkbox
            size="small"
            disabled={disabled}
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
    );
};
export default MiraCalSelectCheckboxHeader;
