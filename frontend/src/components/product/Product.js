import React from 'react'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useLocation } from 'react-router-dom'
import './Product.css';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

function Product() {
  const {state}=useLocation()
  let [mainImage,setMainImage]=useState(state.imageUrls[0]);
  const { loginStatus, currentUser } = useSelector((state) => state.userLogin);
  const token = sessionStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });
  let [err, setErr] = useState('');

  const addCart = async (productid) => {
    if(loginStatus){
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
  }

  return (
    <div className='product-container d-flex align-items-center' style={{gap:"10px"}}>
      <div className='product-display d-flex justify-content-center' style={{gap:"10px"}}>
          <div className='images-show d-flex flex-column justify-content-center '>
              {
                state.imageUrls.map((images)=>
                  <div className='image-box' key={images} style={{width:"60px", height:"60px"}} onClick={()=>setMainImage(images)}>
                    <img src={`${images}`} style={{width:"100%", height:"100%",objectFit:"contain"}}></img>
                  </div>
                )
               
              }          
          </div>
          <div className='product-image' style={{height:"352px", width: "352px"  }} >
              <img src={`${mainImage}`} style={{height:"100%", width: "100%" ,objectFit: "contain" }}></img>
          </div>
      </div>
      <div className='product-details d-flex flex-column align-items-start'style={{flexGrow:"1"}}>

          <div className='product-name'>
            <p style={{fontWeight:"700",fontSize:"1.5rem",textAlign:"left"}}>{`${state.name}`}</p>
          </div>
          
          <div className='product-rating'>
           <Stack spacing={1}>
              <Rating name="half-rating-read" defaultValue={parseFloat(`${state.rating}`)} precision={0.5} readOnly />
            </Stack>
          </div>
          <div className='product-price'>
            <span style={{ fontSize: "28px", fontWeight: "600" }} >                                  
                   {`\u20B9 ${Math.floor((state.price - (state.price * (state.discount / 100))) || 0)}`}
            </span>
          </div>
          <div className='product-mrp'>
                  <p style={{display:"inline-block",margin:"4px"}}>MRP: <span style={{textDecoration:"line-through"}}>&#x20B9; {`${state.price}`}</span></p>
                  <span style={{color:"#eb5757"}}>{`${state.discount}`}% off</span>
          </div>
          <div className='product-brand'>
              <p  style={{ fontSize: "1.2rem", fontWeight: "500" }}>Brand {`${state.brand}`}</p>
          </div>
          <div className='cart-button'>
            <button className='btn btn-warning' onClick={()=>addCart(state.productId)}> Add to Cart</button>
          </div>
          <div className='product-discription' style={{textAlign:"left"}}>
              <p>Description</p>
              <p>{`${state.description}`}</p>
          </div>
        
      </div>

    </div>
  )
}

export default Product