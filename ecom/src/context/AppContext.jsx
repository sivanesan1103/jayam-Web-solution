import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { auth, GoogleProvider } from '../firebaseConfig'
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // products 
    const [products, setProducts] = useState([])
    const [productsLoading, setProductsLoading] = useState(false)
    const [productsError, setProductsError] = useState(null)

    // cart 
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cart')
            return saved ? JSON.parse(saved) : []
        } catch { return [] }
    })

    // wishlist 
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('wishlist')
            return saved ? JSON.parse(saved) : []
        } catch { return [] }
    })

    // orders - 
    const [orders, setOrders] = useState(() => {
        try {
            const saved = localStorage.getItem('orders')
            return saved ? JSON.parse(saved) : []
        } catch { return [] }
    })

    // adminOrders 
    const [adminOrders, setAdminOrders] = useState([])


    const fetchAdminOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/orders')
            setAdminOrders(response.data)
        } catch (error) {
            console.error('Failed to fetch admin orders:', error)
        }
    }

    useEffect(() => {
        fetchAdminOrders()
    }, [])

    // Auth listener 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u)
            setLoading(false)
        }, (err) => {
            console.error('onAuthStateChanged error', err)
            setError(err)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        setProductsLoading(true)
        axios
            .get('https://fakestoreapi.com/products', { signal: controller.signal })
            .then((res) => {
                // Add quantity to API products 
                const productsWithQty = (res.data || []).map((p, index) => ({
                    ...p,
                    quantity: index === 0 ? 0 : Math.floor(Math.random() * 51)
                }))
                setProducts(prev => [...prev, ...productsWithQty])
            })
            .catch((err) => {
                if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return
                console.error('Failed to load products', err)
                setProductsError(err)
            })
            .finally(() => setProductsLoading(false))

        return () => controller.abort()
    }, [])

    // persist cart
    useEffect(() => {
        try { localStorage.setItem('cart', JSON.stringify(cart)) } catch { }
    }, [cart])

    // persist wishlist
    useEffect(() => {
        try { localStorage.setItem('wishlist', JSON.stringify(wishlist)) } catch { }
    }, [wishlist])

    // persist orders
    useEffect(() => {
        try { localStorage.setItem('orders', JSON.stringify(orders)) } catch { }
    }, [orders])

    // Cart functions
    const addToCart = (product, qty = 1) => {
        setCart(prev => {
            const idx = prev.findIndex(it => it.id === product.id)
            if (idx >= 0) {
                const copy = [...prev]
                copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty }
                return copy
            }
            return [...prev, { ...product, qty }]
        })
    }

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(it => it.id !== productId))
    }

    const updateCartQty = (productId, qty) => {
        setCart(prev => prev.map(it => it.id === productId ? { ...it, qty: Math.max(1, qty) } : it))
    }

    const clearCart = () => setCart([])

    // Wishlist functions
    const addToWishlist = (product) => {
        setWishlist(prev => {
            if (prev.find(it => it.id === product.id)) return prev
            return [...prev, product]
        })
    }

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(it => it.id !== productId))
    }

    // Order functions
    const placeOrder = async (cartItems, shippingAddress) => {
        const order = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: cartItems,
            total: cartItems.reduce((sum, it) => sum + it.price * it.qty, 0),
            shippingAddress,
            status: 'On Process'
        }
        setOrders(prev => [order, ...prev])

        // Save to server file
        try {
            await axios.post('http://localhost:3001/api/orders', order)
            setAdminOrders(prev => [order, ...prev])
        } catch (error) {
            console.error('Failed to save order to server:', error)
        }

        clearCart()
        return order
    }

    const updateOrderStatus = async (orderId, status) => {
        // Update locally first (optimistic update)
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
        setAdminOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))

        // Update on server (auto-refresh will sync it back)
        try {
            await axios.put(`http://localhost:3001/api/orders/${orderId}`, { status })
        } catch (error) {
            console.error('Failed to update order status on server:', error)
        }
    }

    const cartCount = cart.length
    const cartTotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0)

    const signInWithGoogle = async () => {
        setLoading(true)
        try {
            const result = await signInWithPopup(auth, GoogleProvider)
           
            if (result?.user) setUser(result.user)
            return result
        } catch (err) {
            console.error('Google sign-in failed', err)
            setError(err)
            return null
        } finally {
            setLoading(false)
        }
    }

    const signOutUser = async () => {
        setLoading(true)
        try {
            await signOut(auth)
            setUser(null)
        } catch (err) {
            console.error('Sign out failed', err)
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AppContext.Provider
            value={{
                user,
                loading,
                error,
                signInWithGoogle,
                signOutUser,
                products,
                productsLoading,
                productsError,
                cart,
                cartCount,
                cartTotal,
                addToCart,
                removeFromCart,
                updateCartQty,
                clearCart,
                wishlist,
                addToWishlist,
                removeFromWishlist,
                orders,
                adminOrders,
                fetchAdminOrders,
                placeOrder,
                updateOrderStatus
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)

export default AppContext
