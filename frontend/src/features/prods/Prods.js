import { useDispatch, useSelector } from 'react-redux';
import { getDataAsync, selectProds } from './prodsSlice';
import { useEffect, useState } from 'react';
import { addItem } from '../cart/cartSlice';
import { toast } from 'react-toastify';
import './Prods.css';
import { BASE_URL } from './prodsAPI';

const Prods = () => {
    const prods = useSelector(selectProds)
    const dispatch = useDispatch();
    const [filteredCategory, setFilteredCategory] = useState(null);


    const buyProduct = (id) => {
        const product = prods.find(prod => prod.id === id);
        dispatch(addItem(product));
        toast.success(`${product.name} added to cart`);
    };

    useEffect(() => {
        dispatch(getDataAsync())
    }, [dispatch])

    const filterByCategory = (category) => {
        setFilteredCategory(category);
    };

    const clearFilter = () => {
        setFilteredCategory(null);
    };
  


    return (
        <div className="container mt-5">
            <br />
            <div className="row">
                <div className="col-md-12 mb-4">
                    <div className="btn-group">
                        <button className={`btn btn-outline-secondary ${filteredCategory === null ? 'active' : ''}`} onClick={clearFilter}>All</button>
                        <button className={`btn btn-outline-secondary ${filteredCategory === 1 ? 'active' : ''}`} onClick={() => filterByCategory(1)}>Dairy</button>
                        <button className={`btn btn-outline-secondary ${filteredCategory === 2 ? 'active' : ''}`} onClick={() => filterByCategory(2)}>Fruits</button>
                        <button className={`btn btn-outline-secondary ${filteredCategory === 3 ? 'active' : ''}`} onClick={() => filterByCategory(3)}>Bakery</button>
                    </div>
                </div>
                {prods
                    .filter((prod) => filteredCategory === null || prod.category === filteredCategory)
                    .map((prod) => (
                        <div className="col-md-4 mb-4" key={prod.id}>
                            <div className="card" style={{ border: '1px solid black', borderRadius: '10px', padding: '10px' }}>
                                {prod.img ? (
                                    <img src={`${BASE_URL}${prod.img}`} className="card-img-top img-fluid" alt={prod.name} style={{ height: '150px', objectFit: 'cover' }} />
                                ) : (
                                    <img src={`${BASE_URL}/media/default.jpg`} className="card-img-top img-fluid" alt="Default" style={{ height: '150px', objectFit: 'cover' }} />
                                )}                                <div className="card-body">
                                    <h5 className="card-title">{prod.name}</h5>
                                    <p className="card-text">${prod.price}</p>
                                    <p className="card-text">{prod.description}</p>
                                    {/* {<button className="btn btn-danger" onClick={() => handleDelete(prod.id)} style={{ margin: '5px' }}>Delete</button>} */}
                                    {/* {<button className="btn btn-primary" onClick={() => handleUpdate(prod.id)}>Update</button>} */}
                                    <button onClick={() => buyProduct(prod.id)} className='btn btn-success cart-button btn-block'>Add to cart</button>
                                </div>
                            </div>
                            <br />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Prods;
