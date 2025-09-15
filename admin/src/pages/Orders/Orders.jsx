import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import{toast} from "react-toastify";


const Orders = ({url}) => {

  const [orders,setOrders] = useState();

  const fetchAllOrders = async()=>{
    const response = await axios.get(url+"/api/order/list");
    if(response.data.success){
      setOrders(response.data.data);
      console.log(response.data.data);
    }else{
      toast.error("Error")
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  },[])
  return (
    <div className='order add'>
      <h3>Order page</h3>
      <div className="order-list">
        {orders.map((order,index)=>(
          <div key={index} className='order-item'>
            <img src="" alt="" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders;