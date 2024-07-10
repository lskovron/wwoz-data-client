import { Container, Typography } from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

export type GridRow = {
  [key: string]: any;
};

type Props = {
  title: string;
  rows: GridRow[];
  columns: GridColDef<any>[];
};

const TablePage = ({ title, rows, columns }: Props) => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3">{title}</Typography>
      <DataGrid
        getRowId={(row) => row._id}
        density="compact"
        columns={columns}
        rows={rows}
      />
    </Container>
  );
};

export default TablePage;
