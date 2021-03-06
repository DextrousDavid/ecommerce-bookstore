import React, { useReducer, useEffect } from 'react';
import { getCategories, list } from './apiCore';
import Card from './Card';

const initialState = {
    categories: [],
    category: 'All',
    search: '',
    results: [],
    searched: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'categories':
            return { ...state, categories: action.value };
        case 'category':
            return { ...state, category: action.value, searched: false };
        case 'search':
            return { ...state, search: action.value, searched: false };
        case 'results':
            return { ...state, searched: true, results: action.value };
        case 'clearResults':
            return { ...state, searched: false, results: [] };
        default:
            return state;
    }
};

const Search = props => {
    const [searchData, dispatch] = useReducer(reducer, initialState);

    const { categories, category, search, results, searched } = searchData;

    const loadCategories = () => {
        getCategories().then(res => {
            if (res.error) {
                console.log(res.error);
            } else {
                dispatch({ type: 'categories', value: res.data });
            }
        });
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const searchExec = () => {
        // console.log(search, category);
        if (search) {
            list({ search: search || undefined, category: category }).then(
                res => {
                    if (res.error) {
                        console.log(res.error);
                    } else {
                        dispatch({ type: 'results', value: res });
                    }
                }
            );
        }
    };

    const searchSubmit = e => {
        e.preventDefault();
        searchExec();
    };
    const handleChange = e => {
        dispatch({ type: e.target.name, value: e.target.value });
    };

    const searchMessage = (searched, results) => {
        if (searched && results.length > 0) {
            return `Found ${results.length} ${
                results.length === 1 ? 'product' : 'products'
            }`;
        }
        if (searched && results.length < 1) {
            return 'No products found';
        }
    };

    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="mt-4, mb-4">
                    {searchMessage(searched, results)}
                </h2>
                <div className="row">
                    {results.map((product, index) => (
                        <div className="col-4 mb-3" key={index}>
                            <Card product={product} />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    //clears the search results when user clears the search field
    useEffect(() => {
        if (search.length === 0 && results.length > 0) {
            dispatch({ type: 'clearResults' });
        }
    }, [search, results]);

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select
                            className="btn mr-2"
                            onChange={handleChange}
                            name="category"
                            value={category}
                        >
                            <option value="All">All</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input
                        type="search"
                        className="form-control"
                        name="search"
                        onChange={handleChange}
                        required
                        placeholder="Search by name"
                    />
                </div>
                <div
                    className="btn input-group-append"
                    style={{ border: 'none' }}
                >
                    <button className="input-group-text">Search</button>
                </div>
            </span>
        </form>
    );

    return (
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
            <div className="container-fluid mb-3">
                {searchedProducts(results)}
            </div>
        </div>
    );
};

export default Search;
