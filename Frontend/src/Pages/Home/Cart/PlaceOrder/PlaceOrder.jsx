import React, { useContext, useEffect, useState } from 'react'
import './placeorder.css'
import StoreContext from '../../../../Context/StoreContext';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

  const {getTotalCartAmount,token,food_list,cartItem,url} = useContext(StoreContext);

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  });

  const onChangeHandler = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

const PlaceOrder = async (event) => {
  event.preventDefault();

  let orderItems = [];
  food_list.forEach((item) => {
    if (cartItem[item._id] > 0) {
      let itemInfo = { ...item, quantity: cartItem[item._id] };
      orderItems.push(itemInfo);
    }
  });

  let orderData = {
    address: data,
    items: orderItems,  
    amount: getTotalCartAmount() + 2,
  };

  try {
 let response = await axios.post(
  url + "/api/order/place",
  orderData,
  {
    headers: {
      token: token,   
    },
  }
);



    console.log("Backend response:", response.data); 

    if (response.data.success) {
      const session_url =
        response.data.session_url || response.data.url || ""; // key

      if (session_url) {
        window.location.replace(session_url);
      } else {
        alert("Payment session URL missing in backend response!");
      }
    } else {
      alert("Error: " + (response.data.message || "Something went wrong"));
    }
  } catch (err) {
    console.error("Order error:", err);
    alert("Server error. Check console.");
  }
};

const navigate = useNavigate();

useEffect(()=>{
  if(!token){
    navigate('/cart')
  }else if(getTotalCartAmount()===0){
    navigate('/cart')
  }
},[token])

  return (
    <form onSubmit={PlaceOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
         <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
         <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
         <div>
            <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery fee</p>
            <p>${getTotalCartAmount()===0?0:2}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Total</p>
            <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
          </div>
         </div>
         <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder;