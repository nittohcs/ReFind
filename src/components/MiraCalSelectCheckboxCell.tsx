import { Checkbox } from "@mui/material";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MiraCalSelectCheckboxCell: ColumnDefTemplate<CellContext<any, any>> = ({ row }) => {
    return (
        <Checkbox
            size="small"
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={event => event.stopPropagation()}
        />
    );
};
export default MiraCalSelectCheckboxCell;
