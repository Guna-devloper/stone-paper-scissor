import React from 'react';
import { useCart } from '../Context/CartContext';

function Cart() {
  const { cart, removeFromCart, clearCart, increaseQty, decreaseQty } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container py-4">
      <h3 className="mb-4 text-primary">🛒 Your Shopping Cart</h3>

      {cart.length === 0 ? (
        <div className="text-center mt-5">
          <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty" width="100" />
          <p className="text-muted mt-3">Your cart is empty. Start shopping!</p>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="card mb-3 shadow-sm">
              <div className="row g-0 align-items-center">
                <div className="col-4 col-md-2">
                  <img
                    src={item.imageBase64 || item.imageURL || 'https://via.placeholder.com/150'}
                    className="img-fluid rounded-start"
                    alt={item.name}
                    style={{ height: '100px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-8 col-md-10">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div>
                      <h5 className="card-title mb-1">{item.name}</h5>
                      <p className="text-muted small mb-1">₹{item.price.toFixed(2)} each</p>

                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => decreaseQty(item.id)}
                          disabled={item.quantity === 1}
                        >
                          −
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => increaseQty(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-end mt-3 mt-md-0">
                      <h6>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</h6>
                      <button
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h5>Total Amount: ₹{total.toFixed(2)}</h5>
            <button className="btn btn-danger" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
