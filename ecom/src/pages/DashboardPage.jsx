import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import Navbar from '../components/Navbar'

const DashboardPage = () => {
  const { cart, wishlist, orders, removeFromCart, updateCartQty, removeFromWishlist, addToCart, placeOrder, user } = useAppContext()
  const [activeTab, setActiveTab] = useState('cart')
  const [selectedAddress, setSelectedAddress] = useState('home')
  const [showAddAddressForm, setShowAddAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', zip: '' })
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 'home', label: 'Home', street: '211 caver nagar 10th street new bus stand thanjavur ', city: 'Thanjavur', zip: '613005' },
    { id: 'work', label: 'Work', street: '211 caver nagar 10th street new bus stand thanjavur', city: 'Thanjavur', zip: '613005' }
  ])

  const cartTotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0)

  const handlePlaceOrder = () => {
    if (cart.length === 0) return
    const address = savedAddresses.find(a => a.id === selectedAddress)
    const fullAddress = `${address.label} - ${address.street}, ${address.city}, ${address.zip}`
    placeOrder(cart, fullAddress)
    alert('Order placed successfully!')
    setActiveTab('orders')
  }

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.street || !newAddress.city || !newAddress.zip) {
      alert('Please fill all address fields')
      return
    }
    const newAddr = {
      id: Date.now().toString(),
      ...newAddress
    }
    setSavedAddresses([...savedAddresses, newAddr])
    setNewAddress({ label: '', street: '', city: '', zip: '' })
    setShowAddAddressForm(false)
    setSelectedAddress(newAddr.id)
  }

  const handleDeleteAddress = (id) => {
    setSavedAddresses(savedAddresses.filter(a => a.id !== id))
    if (selectedAddress === id && savedAddresses.length > 0) {
      setSelectedAddress(savedAddresses[0].id)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab('cart')}
            className={`pb-2 px-4 font-medium ${activeTab === 'cart' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          >
            Cart ({cart.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-2 px-4 font-medium ${activeTab === 'wishlist' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          >
            Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 px-4 font-medium ${activeTab === 'orders' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          >
            Order History ({orders.length})
          </button>
        </div>

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-contain" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-indigo-600 font-bold">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateCartQty(item.id, item.qty - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button onClick={() => updateCartQty(item.id, item.qty + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="px-3 py-1 bg-red-100 text-red-600 rounded">Remove</button>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow mt-6">
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                  
                  {/* Shipping Address Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium">Shipping Address</label>
                      <button
                        onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                      >
                        + Add Address
                      </button>
                    </div>

                    {/* Add Address Form */}
                    {showAddAddressForm && (
                      <div className="border border-gray-300 rounded p-4 mb-3 bg-gray-50">
                        <h4 className="font-medium mb-2">New Address</h4>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Label (e.g., Home, Work)"
                            value={newAddress.label}
                            onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Street Address"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="City"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                              className="flex-1 border rounded px-3 py-2 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="ZIP"
                              value={newAddress.zip}
                              onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                              className="w-24 border rounded px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddAddress}
                              className="flex-1 bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700"
                            >
                              Save Address
                            </button>
                            <button
                              onClick={() => setShowAddAddressForm(false)}
                              className="px-4 bg-gray-300 text-gray-700 py-2 rounded text-sm hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Saved Addresses List */}
                    <div className="space-y-2">
                      {savedAddresses.map(address => (
                        <div
                          key={address.id}
                          className={`border rounded p-3 cursor-pointer transition ${
                            selectedAddress === address.id
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setSelectedAddress(address.id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddress === address.id}
                              onChange={() => setSelectedAddress(address.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{address.label}</div>
                              <div className="text-sm text-gray-600">{address.street}</div>
                              <div className="text-sm text-gray-600">{address.city}, {address.zip}</div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteAddress(address.id)
                              }}
                              className="text-red-500 text-sm hover:text-red-700"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl mb-4">
                    <span>Total:</span>
                    <span className="text-indigo-600">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
            {wishlist.length === 0 ? (
              <p className="text-gray-600">Your wishlist is empty</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wishlist.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                    <img src={item.image} alt={item.title} className="w-full h-40 object-contain mb-3" />
                    <h3 className="font-semibold line-clamp-2 mb-2">{item.title}</h3>
                    <p className="text-indigo-600 font-bold mb-3">${item.price}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { addToCart(item); removeFromWishlist(item.id) }}
                        className="flex-1 bg-indigo-600 text-white py-2 rounded text-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                     
                      </div>
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        order.status === 'On Process' ? 'bg-yellow-100 text-yellow-700' : 
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-medium">Shipping Address:</p>
                      <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                    </div>
                    <div className="space-y-2 mb-3">
                      {order.items.map(item => (
                        <div key={item.id} className="text-sm">
                          {item.title} x {item.qty} - ${(item.price * item.qty).toFixed(2)}
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2">
                      <span className="font-bold">Total: </span>
                      <span className="text-indigo-600 font-bold text-xl">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default DashboardPage
