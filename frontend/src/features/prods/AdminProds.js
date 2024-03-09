import { useDispatch, useSelector } from 'react-redux';
import { deleteDataAsync, getDataAsync, addDataAsync, updateDataAsync, selectProds } from './prodsSlice';
import { useEffect, useState } from 'react';
import { selectAdmin, selectIsLoggedIn } from '../login/loginSlice';
import { addItem } from '../cart/cartSlice';
import { toast } from 'react-toastify';
import './Prods.css';
import { BASE_URL } from './prodsAPI';
import { useNavigate } from 'react-router-dom';

const AdminProds = () => {
    const prods = useSelector(selectProds)
    const dispatch = useDispatch();
    const [refresh, setrefresh] = useState(true)
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState("1")
    const [img, setImg] = useState(null);
    const isLogged = useSelector(selectIsLoggedIn)
    const [filteredCategory, setFilteredCategory] = useState(null);
    const isAdmin = useSelector(selectAdmin)
    const navigate = useNavigate();

    // use a flag to refresh the data when a new product is added/updated/deleted
    useEffect(() => {
        dispatch(getDataAsync())
    }, [refresh, dispatch])

    //useeffct that sets that if a user is no longer logged in or admin then navigate to '/':
    useEffect(() => {
        if (!isLogged || !isAdmin) {
            navigate('/')
        }
    }, [isLogged, isAdmin, navigate])
    
    const handleDelete = async (id) => {
        await dispatch(deleteDataAsync(id))
        setrefresh(!refresh)
    }

    const handleAdd = async (newData) => {
            // Create a FormData object to send data including the image file
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("category", category);
            if (img !== null) {
                formData.append("img", img); // Append the image file to the FormData object
            }
            await dispatch(addDataAsync(formData));
        
        setrefresh(!refresh);
    };

    const handleUpdate = async (id) => {
        if (img === null) {
            console.log("Updating product with ID:", id);
            await dispatch(updateDataAsync({ name, price, category, id }));
        } else {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("name", name);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("img", img);
            console.log("Updating product with formData and ID:", id);
            console.log("New data:", { name, price, category, img, id });
            await dispatch(updateDataAsync(formData)); // Pass formData and id directly
        }


        setrefresh(!refresh);
    };

    const buyProduct = (id) => {
        const product = prods.find(prod => prod.id === id);
        dispatch(addItem(product));
        toast.success(`${product.name} added to cart`);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImg(file);
    };

    const filterByCategory = (category) => {
        setFilteredCategory(category);
    };

    const clearFilter = () => {
        setFilteredCategory(null);
    };

    return (
        <div className="container mt-5">
            Admin Prods
            {isAdmin && (
                <div className="row mt-5 add-product">
                    <div className="col-md-4">
                        <h2 className="mb-4">Add Product</h2>
                        <input type="text" className="form-control mb-3" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="number" className="form-control mb-3" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                        <select value={category} placeholder="Category" onChange={(e) => setCategory(e.target.value)} className="form-select mb-3" style={{ width: '100%', padding: '5px' }}>
                            <option value="null" disabled>Category Selection</option>
                            <option value="1">Dairy</option>
                            <option value="2">Fruits</option>
                            <option value="3">Bakery</option>
                        </select>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ margin: '10px' }} />
                        <button className="btn btn-primary mb-3" onClick={() => handleAdd({ name, price, category })}>Add Product</button>
                    </div>
                </div>
            )}
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
                                    {isAdmin && <button className="btn btn-danger" onClick={() => handleDelete(prod.id)} style={{ margin: '5px' }}>Delete</button>}
                                    {isAdmin && <button className="btn btn-primary" onClick={() => handleUpdate(prod.id)}>Update</button>}
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

export default AdminProds;
