import React, { Fragment, useState, useEffect } from 'react';
import data from './data';

const Table = () => {
    const [state, setState] = useState({
        data: [],
        all_selected: false,
        selected_ids: [],
        search_value: "",
        replica_data: [],
        show_input: false,
        edit_id: ""
    });

    useEffect(() => {
        setState({ ...state, data: data, replica_data: data })
        return () => {
            console.log('Table unmounted')
        }
    }, []);

    const handleAllSelected = e => {
        if (e.target.checked) {
            let _selected_ids = [...state.selected_ids];
            state.data.forEach(element => {
                _selected_ids.push(element.id);
            });
            setState({ ...state, all_selected: e.target.checked, selected_ids: _selected_ids });
        } else {
            state.selected_ids.forEach(element => {
                state[element] = false;
            });
            setState({ ...state, all_selected: e.target.checked, selected_ids: [] })
        }
    }

    const handleSelection = (e, id) => {
        let _selected_ids = [...state.selected_ids];
        if (e.target.checked) {
            _selected_ids.push(id);
            setState({ ...state, [id]: e.target.checked, selected_ids: _selected_ids });
        } else {
            console.log(id, "ididididididiid")
            _selected_ids.splice(_selected_ids.indexOf(id), 1);

            state.selected_ids.forEach(element => {
                if (element != id) {
                    state[element] = true;
                }
            });
            setState({ ...state, [id]: e.target.checked, selected_ids: _selected_ids, all_selected: false });
        }
    }

    const handleSearch = e => {
        let arr = [...state.data];
        let obj = arr.filter(o => o.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setState({ ...state, search_value: e.target.value, replica_data: obj });
        console.log(obj)
    }

    const handlePrice = (e, id) => {
        if (e.key == 'Enter') {
            setState({ ...state, show_input: false })
        } else {
            let _data = [...state.data];
            _data.forEach(element => {
                if (element.id == id) {
                    element.price = e.target.value;
                }
            });
            setState({ ...state, data: _data });
        }
    }

    const handleReset = () => {
        setState({
            data: data,
            all_selected: false,
            selected_ids: [],
            search_value: "",
            replica_data: data,
            show_input: false,
            edit_id: ""
        })
    };

    const handleDelete = () => {
        let _data = [...state.replica_data];
        let _selected_ids = [...state.selected_ids];
        for (var i = 0; i < _data.length; i++) {
            var obj = _data[i];
            if (_selected_ids.indexOf(obj.id) !== -1) {
                _data.splice(i, 1);
                i--;
            }
        }
        setState({ ...state, replica_data: _data })
    }

    return (
        <Fragment>
            <table>
                <thead>
                    <tr>
                        <th><input type="checkbox" checked={state.all_selected} onChange={handleAllSelected} /></th>
                        <th>ID</th>
                        <th>Name<br /><input type="text" value={state.search_value} onChange={handleSearch} /></th>
                        <th>Price</th>
                        <th>Coupon</th>
                        <th>In stock</th>
                    </tr>
                </thead>
                <tbody>
                    {state.replica_data.map((item, i) => (
                        <tr key={item.id}>
                            <th><input type="checkbox" checked={state.all_selected ? true : state[item.id] ? true : false} onChange={e => handleSelection(e, item.id)} /></th>
                            <th>{item.id}</th>
                            <th>{item.name}</th>
                            <th>{state.show_input && item.id == state.edit_id ? <input type="text" value={item.price} autoFocus onBlur={() => setState({ ...state, show_input: false })} onKeyDown={e => handlePrice(e, item.id)} onChange={e => handlePrice(e, item.id)} /> : <span onClick={() => setState({ ...state, show_input: true, edit_id: item.id })}>{item.price}</span>}</th>
                            <th>{item.coupon}</th>
                            <th>{item.in_stock}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleReset}>Reset</button>
        </Fragment>
    )
}
export default Table;