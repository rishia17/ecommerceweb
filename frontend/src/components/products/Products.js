import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import './Products.css';
import * as React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import queryString from 'query-string';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function Products() {
  const { loginStatus, currentUser } = useSelector((state) => state.userLogin);
  const [productsList, setProductsList] = useState([]);
  const token = sessionStorage.getItem('token');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });
  let [err, setErr] = useState('');

  const getAllProducts = async () => {
    let res;
    if (filteredProducts.length !== 0) {
      getFilteredProducts(filteredProducts);
    } else {
      if (currentUser.userType === "admin") {
        res = await axiosWithToken.get(`http://localhost:5500/admin-api/products`)
      } else {
        res = await axiosWithToken.get(`http://localhost:5500/user-api/products`)
      }
      if (res.data.message === 'all products') {
        setProductsList(res.data.payload)
      } else {
        setErr(res.data.message)
      }
    }
  }
  
  useEffect(() => {
    getAllProducts()
  }, [])

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const location = useLocation();

  useEffect(() => {
    const parsedFilters = queryString.parse(location.search);
    const { category = [], brand = [], minPrice = 0, maxPrice = 300000 } = parsedFilters;

    setCategories(Array.isArray(category) ? category : [category]);
    setBrands(Array.isArray(brand) ? brand : [brand]);
    setPriceRange([Number(minPrice), Number(maxPrice)]);
  }, [location.search]);

  useEffect(() => {
    const filtered = productsList.filter(product => {
      if (categories.length && !categories.includes('All') && !categories.includes(product.category)) {
        return false;
      }
      if (brands.length && !brands.includes('All') && !brands.includes(product.brand)) {
        return false;
      }
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      return true;
    });
    setFilteredProducts(filtered);
  }, [categories, brands, priceRange, productsList]);

  const getFilteredProducts = async (filterObj) => {
    let res;
    if (filterObj != null) {
      setPage(1);
      if (currentUser.userType === "admin") {
        res = await axiosWithToken.post(`http://localhost:5500/admin-api/product-filter`, filterObj)
      } else {
        res = await axiosWithToken.post(`http://localhost:5500/user-api/product-filter`, filterObj)
      }
      if (res.data.message === 'filtered products') {
        setProductsList(res.data.payload)
      } else {
        setErr(res.data.message)
      }
    } else {
      setPage(1);
      getAllProducts();
    }
  }

  const handleFilterChange = (type, value) => {
    const currentFilters = { categories, brands, priceRange };
    if (type === 'category') {
      const newCategories = categories.includes(value)
        ? categories.filter(c => c !== value)
        : [...categories, value];
      currentFilters.categories = newCategories.length ? newCategories : [''];
    } else if (type === 'brand') {
      const newBrands = brands.includes(value)
        ? brands.filter(b => b !== value)
        : [...brands, value];
      currentFilters.brands = newBrands.length ? newBrands : [''];
    } else if (type === 'price') {
      currentFilters.priceRange = value;
    }

    const query = queryString.stringify({
      category: currentFilters.categories,
      brand: currentFilters.brands,
      minPrice: currentFilters.priceRange[0],
      maxPrice: currentFilters.priceRange[1]
    });
    navigate(`?${query}`);
    const filters = {
      categories: currentFilters.categories,
      brands: currentFilters.brands,
      minPrice: currentFilters.priceRange[0],
      maxPrice: currentFilters.priceRange[1]
    };

    getFilteredProducts(filters);
  };

  const clearFilters = () => {
    setCategories([]);
    setBrands([]);
    setPriceRange([0, 30000]);
    navigate(`?`);
    getFilteredProducts({ categories: [], brands: [], minPrice: 0, maxPrice: 30000 });
  };

  const getProductDetails = (productObj) => {
    navigate(`../product`, { state: productObj });
  }

  const addCart = async (productid) => {
    let cartObj = {
      userName: currentUser.userName,
      productId: productid
    }
    if (currentUser.userType === 'user') {
      const res = await axiosWithToken.post(`http://localhost:5500/user-api/cart`, cartObj)
      if (res.data.message === 'product added') {
        // console.log("added")
      } else {
        setErr(res.data.message)
      }
    }
  }

  return (
    <div className="products-container d-flex" style={{marginTop:'2%',gap:'20px'}}>
      {/* Sticky Filters */}
      <div className='filters-container d-flex flex-column position-sticky' style={{ top: "10px", minWidth: "250px", marginLeft: "40px", height: "fit-content" }}>
        <div className='filters-category d-flex flex-column align-items-start'>
          <span style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "500" }}>Categories</span>
          {['All', 'Mobile', 'TV', 'IPAD', 'Laptop', 'Watch', 'Accessories'].map(category => (
            <label key={category}>
              <input
                type="checkbox"
                value={category}
                checked={categories.includes(category)}
                onChange={() => handleFilterChange('category', category)}
              />
              {category}
            </label>
          ))}
        </div>
        <div className='filters-brand d-flex flex-column align-items-start'>
          <span style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "500" }}>Brands</span>
          {['All', 'samsung', 'iphone', 'redmi', 'boat'].map(brand => (
            <label key={brand}>
              <input
                type="checkbox"
                value={brand}
                checked={brands.includes(brand)}
                onChange={() => handleFilterChange('brand', brand)}
              />
              {brand}
            </label>
          ))}
        </div>
        <div className='filters-price d-flex flex-column align-items-start'>
          <span style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "500" }}>Price Range</span>
          <Slider
            range
            min={0}
            max={30000}
            value={priceRange}
            style={{ width: "100%", color: "black" }}
            onChange={value => handleFilterChange('price', value)}
          />
          <div>
            <span>Min: &#x20B9;{priceRange[0]}</span>
            <span>Max: &#x20B9;{priceRange[1]}</span>
          </div>
        </div>
        <div className='button-filter'>
          <button className='btn btn-danger' onClick={clearFilters}> Clear filters</button>
        </div>
      </div>

      {/* Product Display */}
      <div className='products-list d-flex flex-column' style={{ flexGrow: 1 }}>
        {productsList.length === 0 ? (
          <p className='text-center'>No products found</p>
        ) : (
          <div className='container-display d-flex flex-column' style={{ gap: "10px" }}>
            {productsList.slice(page * 10 - 10, page * 10).map((product) => (
              <div className="container2" key={product.productId} style={{ width: "100%", height: "85%" }}>
                <div className="card2 d-flex flex-row align-items-center" style={{ gap: "10px", borderRadius: "10px", border: "1px solid black", boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)" }}>
                  <div className='card-side1 d-flex align-items-center justify-content-center'>
                    <img src={`${product.imageUrls[0]}`} style={{ height: "200px", width: "250px", objectFit: "contain" }} onClick={() => getProductDetails(product)}></img>
                  </div>
                  <div className="card-side2 d-flex flex-column align-items-start">
                    <p onClick={() => getProductDetails(product)} style={{ margin: "0px", fontWeight: "500", textAlign: "left", fontSize: "1.2rem" }}>{`${product.name}`}</p>
                    <div>
                      <Stack spacing={1}>
                        <Rating name="half-rating-read"  defaultValue={parseFloat(`${product.rating}`)} precision={0.5} readOnly />
                      </Stack>
                    </div>
                    <div>
                      <div className='card-price'>
                        <span style={{ fontSize: "28px", fontWeight: "600" }} onClick={() => getProductDetails(product)}>
                          {`\u20B9 ${Math.floor((product.price - (product.price * (product.discount / 100))) || 0)}`}
                        </span>
                      </div>
                    </div>
                    <div className='card-mrp' onClick={() => getProductDetails(product)}>
                      <p>MRP: <span style={{ textDecoration: "line-through" }}>&#x20B9; {`${product.price}`}</span></p>
                    </div>
                    <button className='btn btn-warning' onClick={() => addCart(product.productId)}> Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {productsList.length !== 0 && (
          <div className='pagination-btn'>
            {page === 1 ? (
              <>
                <button className='btn' disabled>Page 1</button>
                <button className='btn' disabled>Previous</button>
              </>
            ) : (
              <>
                <button className='btn' onClick={() => setPage(1)}> Page 1 </button>
                <button className='btn' onClick={() => setPage(page - 1)}>Previous</button>
              </>
            )}
            <p style={{ margin: "0px" }}>Page {`${page}`} of {`${Math.ceil(productsList.length / 10)}`}</p>
            {page >= Math.ceil(productsList.length / 10) ? (
              <button className='btn' disabled>Next</button>
            ) : (
              <button className='btn' onClick={() => setPage(page + 1)}>Next</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products;
