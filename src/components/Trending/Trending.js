import React, { useEffect, useState } from 'react'
import "./Trending.css";
import { DataGrid } from '@material-ui/data-grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';

const columns = [
    { field: 'id', headerName: 'ID', hide: true },
    { 
        field: 'owner', 
        headerName: 'Owner', 
        sortable: false,
        cellClassName: 'cell',
        valueGetter: (params) =>`${params.row.owner.login}`
    },
    { field: 'full_name', headerName: 'Name', sortable: false, cellClassName: 'cell',},
    { field: 'description',headerName: 'Summary', sortable: false, cellClassName: 'cell',},
    { field: 'stargazers_count',headerName: 'Total Stars', cellClassName: 'cell',},
    { field: 'forks',headerName: 'Forks',sortable: false, cellClassName: 'cell',}
];
const sortModel = [{field: 'stargazers_count',sort: 'desc'}];
const dateOptions = [{title: 'Today', value:'today'}, { title: 'This week', value:'week'}, {title: 'This month', value:'month'}];

function Trending() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(3);
    const [btnName, setBtnName] = useState('Expand');
    const [searchVal, setSearchVal] = useState('');
    const [fullList, setFullList] = useState([]);
    const today = new Date();
    const [date, setDate] = useState(today.getFullYear() + '-' + ("0" + (today.getMonth()+1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2));
    
    useEffect(() => {
        fetch(`https://api.github.com/search/repositories?sort=stars&order=desc&q=created:>=${date}&per_page=12`).then(resp=>resp.json()).then(jsonData => {
            setRows(jsonData.items)
            setFullList(jsonData.items)
    });
    }, [date]);
    const expandClick = () => {
        setPage(prev => prev+3 > 12 ? 3 : prev + 3);
        page === 9 ? setBtnName('Collapse') : setBtnName('Expand');
    };
    const onDateChange = (e) => {
        const val = e ? e.target.textContent : 'Today';
        if(val.includes('Today')) {
            setDate(today.getFullYear() + '-' + ("0" + (today.getMonth()+1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2));
        } else if(val.includes('week')) {
            setDate(today.getFullYear() + '-' + ("0" + (today.getMonth()+1)).slice(-2) + '-' + ("0" + (today.getDate()-7)).slice(-2));
        } else {
            setDate(today.getFullYear() + '-' + ("0" + (today.getMonth())).slice(-2) + '-' + ("0" + today.getDate()).slice(-2));
        }
    }
    function onSearch(e) {
        setSearchVal(e.target.value);
        if(e.target && e.target.value) {
            let val = e.target.value.toLowerCase();
            let filterList = [];
            for(let i=0; i<fullList.length; i++) {
                let login = fullList[i].owner.login ? fullList[i].owner.login.toLowerCase() : '';
                let fullName = fullList[i].full_name ? fullList[i].full_name.toLowerCase() : '';
                let description = fullList[i].description ? fullList[i].description.toLowerCase() : '';
                if(login.includes(val) || fullName.includes(val) || description.includes(val)) {
                    filterList.push(fullList[i]);
                }
            }
            setRows(filterList);
        } else {
            setRows(fullList);
        }
    }
    return (
        <div className='trends'>
            <div className='filters'>
                <TextField id="search" data-testid="search" style={{width: '320px'}} onChange={onSearch} value={searchVal} label="Search-Owner/Name/Summary" variant="outlined" />
                <div className='container'>
                    <Autocomplete data-testid="date" className='filter' size="small" id="dateRange" defaultValue={dateOptions[0]} onInputChange={onDateChange} options={dateOptions} getOptionLabel={(option) => option.title} style={{ width: 150 }} renderInput={(params) => <TextField {...params} label="Date range" variant="outlined" />}/>
                    <Button className='filter' style={{ height: 48 }} variant="contained" onClick={expandClick}>{btnName}</Button>
                </div>
                
            </div>
            <div className='grid' style={{ height: 700 }}>
                <DataGrid rows={rows} columns={columns} sortModel={sortModel} hideFooter={true} pageSize={page} />
            </div>
            
        </div>
    )
}

export default Trending