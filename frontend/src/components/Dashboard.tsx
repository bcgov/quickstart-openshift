import apiService from "@/service/api-service";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import type { AxiosResponse } from "~/axios";

const columns = [
  {
    field: "id",
    headerName: "Employee ID",
    sortable: true,
    filterable: true,
    flex: 1,
    renderHeader: (params: any) => (
      <div id={`${params.field}`}>
        Employee ID
      </div>
    )
  },
  {
    field: "name",
    headerName: "Employee Name",
    sortable: true,
    filterable: true,
    flex: 1,
    renderHeader: (params: any) => (
      <div id={`${params.field}`}>
        Employee Name
      </div>
    )
  },
  {
    field: "email",
    headerName: "Employee Email",
    sortable: true,
    filterable: true,
    flex: 1,
    renderHeader: (params: any) => (
      <div id={`${params.field}`}>
        Employee Email
      </div>
    )
  }
];
export default function Dashboard() {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    apiService
      .getAxiosInstance()
      .get("/v1/users")
      .then((response: AxiosResponse) => {
        const users = [];
        for (const user of response.data) {
          const userDto = {
            id: user.id,
            name: user.name,
            email: user.email
          };
          users.push(userDto);
        }
        setData(users);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClose = () => {
    setSelectedRow(null);
  };
  return (
    <div
      style={{
        minHeight: "45em",
        maxHeight: "45em",
        width: "100%",
        marginLeft: "4em"
      }}
    >
      <DataGrid

        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        experimentalFeatures={{ ariaV7: true }}
        checkboxSelection={false}
        rows={data}
        columns={columns}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        getRowId={(row) => row["id"]}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
      <Dialog open={!!selectedRow} onClose={handleClose}>
        <DialogTitle>Row Details</DialogTitle>
        <DialogContent>
          <Table>
            <TableBody>
              {selectedRow &&
                Object.entries(selectedRow).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
