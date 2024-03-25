import React, { useState, useEffect } from 'react';

import { forwardRef } from 'react';
// import Avatar from 'react-avatar';
// import Grid from '@material-ui/core/Grid'
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios'
const tableIcons = {

    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function Table() {
    var columns = [
        { title: "id", field: "id", hidden: true, editable: false },
        {
            title: 'Avatar',
            field: 'avatar',
            render: rowData => (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                    style={{ height: 36, borderRadius: '50%' }}
                    src={rowData.avatar}
                />
            ),
        },
        {
            title: "Name", field: "name"
        },
        { title: "Email", field: "email" },
        { title: "Role", field: "role",
        lookup: {
            'admin': 'admin',
            'customer': 'customer',
        }
    },

        { title: "Password", field: "password" },
        { title: "CreationAt", field: "creationAt" },
        { title: "UpdatedAt", field: "updatedAt" },
    ]
    const [data, setData] = useState([]); //table data
    const api = ` https://api.escuelajs.co/api/v1/users/`;

    useEffect(() => {
        fetchData();
    }, );
    const fetchData = async () => {
        try {
            const response = await axios.get(api);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    return (
        <div className="App" style={{ marginTop: "60px" }}>
            <h2 style={{ textAlign: "center" }}>
                Users Details
            </h2>
            <MaterialTable
                mt={90}
                title="Users Details"
                columns={columns}
                data={data}
                icons={tableIcons}
                options={{
                    selection: true,
                    columnsButton: true,
                    draggable: true,
                    grouping: false,
                    sorting: true,
                    search: true,
                    paging: true,
                    pageSizeOptions: [5, 10, 20, 25, 50, 75, 100],
                    paginationPosition: "both",
                    exportButton: true,
                    exportAllData: true,
                    exportFileName: "Users Data",
                    filtering: true,
                    searchFieldAlignment: "right",
                    searchAutoFocus: true,
                    searchFieldVariant: "outlined",
                    actionsColumnIndex: -1,
                    addRowPosition: "first",
                    headerStyle: {
                        // size: '150px',
                        fontStyle: "italic", backgroundColor: "skyblue"
                    },
                }}
                
                cellEditable={{
                    onCellEditApproved: async (newData, oldData, rowData, columnDef) => {
                        return new Promise((resolve, reject) => {
                            const updatedRow = { ...rowData, [columnDef.field]: newData };
                            console.log(updatedRow);
                            axios.put(`${api}${updatedRow.id}`, updatedRow)
                                .then(() => {
                                    // resolve()
                                    setTimeout(() => {
                                        setData(data.map(row => (row.id === updatedRow.id ? updatedRow : row)));
                                        fetchData();
                                        resolve();
                                    }, 2000);
                                })
                                .catch(error => {
                                    console.error('Error updating users:', error);
                                    reject();
                                });
                        });
                    }
                }}
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            axios.put(`${api}${oldData.id}`, newData)
                                .then(() => {
                                    setTimeout(() => {
                                        fetchData();
                                        resolve();
                                    }, 2000);
                                })
                                .catch(error => {
                                    console.error('Error updating user:', error);
                                    reject();
                                });

                        }),
                    onRowAdd: (newData) =>
                        new Promise((resolve, reject) => {
                            axios.post(`${api}`, newData)
                                .then(() => {
                                    setTimeout(() => {
                                        fetchData();
                                        resolve();
                                    }, 2000);
                                })
                                .catch(error => {
                                    console.error('Error adding user:', error);
                                    reject();
                                });
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve, reject) => {
                            axios.delete(`${api}${oldData.id}`)
                                .then(() => {
                                    setTimeout(() => {
                                        fetchData();
                                        resolve();
                                    }, 2000);
                                })
                                .catch(error => {
                                    console.error('Error deleting user:', error);
                                    reject();
                                });

                        }),
                }}

            />
        </div>
    );
}
export default Table;
