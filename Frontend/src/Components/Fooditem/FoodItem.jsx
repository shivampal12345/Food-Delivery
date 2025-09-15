import React, {useContext}  from 'react'
import './FoodItem.css'
import { assets } from '../../assets/frontend_assets/assets'
import StoreContext from '../../Context/StoreContext'

const FoodItem = ({id,name,price,description,image}) => {

  const{cartItem,addToCart,removeFromCart,url} = useContext(StoreContext);

  return (
    <div className='food-item'>
      <div className="food-item-image-container">
        <img src={url+"/images/"+image} alt="" className="food-item-image" />
        {!cartItem[id]
          ?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
          : <div className='food-item-counter'>
            <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
            <p>{cartItem[id]}</p>
            <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
          </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <div className="food-item-desc">{description}</div>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  )
}

export default FoodItem;