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
import Alert from '@material-ui/lab/Alert';
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



function validateEmail(email) {
    // eslint-disable-next-line no-control-regex
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}

function Service() {

    var columns = [
        { title: "id", field: "id", hidden: true },

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
        { title: "Role", field: "role" },
        { title: "Password", field: "password" },
        // { title: "Avatar", field: "avatar" },
        { title: "CreationAt", field: "creationAt" },
        { title: "UpdatedAt", field: "updatedAt" },

    ]
    const [data, setData] = useState([]); //table data

    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])


    useEffect(() => {
        // Function to fetch data from the database
        const fetchData = async () => {
            try {
                // Make a GET request using Axios
                const response = await axios.get('http://localhost:3000/users/');

                // Set the fetched data to the component state
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call the fetchData function when the component mounts
        fetchData();
    }, []);

    const handleRowUpdate = async (newData, oldData, resolve) => {
        //validation
        let errorList = []
        if (newData.name === "") {
            errorList.push("Please enter  name")
        }
        if (newData.password === "") {
            errorList.push("Please enter password")
        }
        if (newData.avatar === "") {
            errorList.push("Please enter avatar")
        }
        if (newData.role === "") {
            errorList.push("Please enter role")
        }

        if (newData.email === "" || validateEmail(newData.email) === false) {
            errorList.push("Please enter a valid email")
        }
        if (errorList.length < 1) {

            try {
                const response = await axios.put('http://localhost:3000/users/' + newData.id, newData);
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                resolve()
                setIserror(false)
                console.log('Data updated successfully:', response.data);
            } catch (error) {
                console.error('Error updating data:', error);
            }

        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }
    }
    // const handleRowAdd = async (newData, resolve) => {
    //     let errorList = []
    //     if (newData.name === undefined) {
    //         errorList.push("Please enter name")
    //     }
    //     if (newData.avatar === undefined) {
    //         errorList.push("Please enter avatar url ")
    //     }
    //     if (newData.password === undefined) {
    //         errorList.push("Please enter password ")
    //     }
    //     if (newData.creationAt === undefined) {
    //         errorList.push("Please enter creation date ")
    //     }
    //     if (newData.updatedAt === undefined) {
    //         errorList.push("Please enter update date ")
    //     }
    //     if (newData.email === undefined || validateEmail(newData.email) === false) {
    //         errorList.push("Please enter a valid email")
    //     }

    //     if (errorList.length < 1) { //no error
    //         // const mydata = JSON.stringify(newData);
    //         try {
    //             const response = await axios.post('https://api.escuelajs.co/api/v1/users/', newData);
    //             let dataToAdd = [...data];
    //             dataToAdd.push(newData);
    //             setData(dataToAdd);
    //             setErrorMessages([]);
    //             resolve()
    //             setIserror(false)
    //             console.log('Data added successfully:', response.data);
    //         } catch (error) {
    //             console.error('Error updating data:', error);
    //         }
    //     } else {
    //         setErrorMessages(errorList)
    //         setIserror(true)
    //         resolve()
    //     }
    // }
    const handleRowAdd = async (newData, resolve) => {
        //validation
        let errorList = []
        if (newData.name === undefined) {
            errorList.push("Please enter name")
        }

        if (newData.password === undefined) {
            errorList.push("Please enter password")
        }
        if (newData.avatar === undefined) {
            errorList.push("Please enter avater")
        }
        if (newData.email === undefined || validateEmail(newData.email) === false) {
            errorList.push("Please enter a valid email")
        }

        if (errorList.length < 1) { //no error

            try {
                const response = await axios.post('http://localhost:3000/users/', newData);
                let dataToAdd = [...data];
                dataToAdd.push(newData);
                setData(dataToAdd);
                resolve()
                setErrorMessages([])
                setIserror(false)
                console.log('Data added successfully:', response.data);
            } catch (error) {
                console.error('Error server data:', error);
            }

        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }
    }

    const handleRowDelete = async (oldData, resolve) => {

        try {
            const response = await axios.delete(`http://localhost:3000/users/${oldData.id}`);
            const dataDelete = [...data];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            setData([...dataDelete]);
            resolve()
            setIserror(false)
            console.log('Data deleted successfully:', response.data);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }


    const handleCellEditApproved = async (newData, rowData, columnDef, resolve) => {
        const updatedRow = { ...rowData, [columnDef.field]: newData };

        console.log(updatedRow);
        try {
            const response = await axios.put(`http://localhost:3000/users/${updatedRow.id}`, updatedRow);
            console.log('Data updated successfully:', response.data);

            // Update table data (assuming React's useState)
            setData(data.map(row => (row.id === updatedRow.id ? updatedRow : row)));
            resolve()
            setIserror(false)
            setTimeout(resolve, 1000);
        } catch (error) {
            console.error('Error updating data:', error);
            // Display an error message to the user (e.g., using Material-Table's snackbar)
        }
    };

    return (
        <div className="App" style={{ marginTop: "60px" }}>
            <h2 style={{ textAlign: "center" }}>
                Users Details
            </h2>
            {/* <Grid container spacing={1}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}> */}
            <div>
                {iserror &&
                    <Alert severity="error">
                        {errorMessages.map((msg, i) => {
                            return <div key={i}>{msg}</div>
                        })}
                    </Alert>
                }
            </div>
            <MaterialTable
                mt={90}

                title="Users Details"
                columns={columns}
                data={data}
                icons={tableIcons}
                Filter
                options={{
                    selection: true,
                    draggable: true,
                    grouping: false,
                    sorting: true,
                    search: true,
                    paging: true,
                    // actionsColumnIndex:-1,
                    addRowPosition: "first",
                    headerStyle: { size: '80px' },
                }}
                cellEditable={{
                    onCellEditApproved: async (newData, oldData, rowData, columnDef) => {
                        return new Promise((resolve, reject) => {
                            // handleRowUpdate(newData, oldData, resolve);
                            handleCellEditApproved(newData, rowData, columnDef, resolve)

                        });
                    }
                }}
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            handleRowUpdate(newData, oldData, resolve);

                        }),
                    onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            handleRowAdd(newData, resolve)
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            handleRowDelete(oldData, resolve)
                        }),
                }}

            />
            {/* </Grid>
                <Grid item xs={1}></Grid>
            </Grid> */}
        </div>
    );
}

export default Service;