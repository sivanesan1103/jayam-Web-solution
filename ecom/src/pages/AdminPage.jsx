import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const AdminPage = () => {
  const { adminOrders, updateOrderStatus, fetchAdminOrders } = useAppContext()
  const navigate = useNavigate()

  // Fetch orders when component mounts (React way - only once)
  useEffect(() => {
    fetchAdminOrders()
  }, []) // Empty dependency = runs only on mount

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex gap-2">
            <button 
              onClick={fetchAdminOrders} 
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              🔄 Sync Orders
            </button>
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-200 rounded">Back to Shop</button>
            <span className="px-4 py-2 bg-red-100 text-red-600 rounded font-medium">Admin Mode</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Orders ({adminOrders.length})</h2>
        
          </div>
          
          {adminOrders.length === 0 ? (
            <p className="text-gray-600">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {adminOrders.map(order => (
                <div key={order.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">{new Date(order.date).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="border rounded px-3 py-1 text-sm font-medium"
                      >
                        <option value="On Process">On Process</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3 bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium">Shipping Address:</p>
                    <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2">Items:</p>
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span>{item.title} x {item.qty}</span>
                        <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-bold">Total:</span>
                    <span className="text-indigo-600 font-bold text-xl">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
