import { useAppContext } from '../context/AppContext'

const Cards = ({ products: filteredProducts }) => {
    const { products: postsRaw, productsLoading, productsError, addToCart, addToWishlist } = useAppContext()
    
    // Use filtered products if provided, otherwise use all products
    const posts = filteredProducts !== undefined ? filteredProducts : (postsRaw || [])

    if (productsLoading) return <p className="text-center mt-6">Loading products…</p>
    if (productsError) return <p className="text-center mt-6 text-red-500">Error loading products.</p>
    if (!posts.length) return <p className="text-center mt-6">No products found.</p>

    return (
        <section className="mt-6 mx-auto px-4 max-w-screen-xl md:px-8">
            <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {posts.map((item) => {
                    const isOutOfStock = (item.quantity || 0) === 0
                    
                    return (
                    <article
                        key={item.id}
                        className={`flex flex-col h-full rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 ${
                            isOutOfStock ? 'bg-gray-100 opacity-60' : 'bg-white'
                        }`}
                    >
                        <div className="bg-gray-50 flex items-center justify-center h-48 p-4">
                            <img
                                src={item.image}
                                loading="lazy"
                                alt={item.title}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className={`text-base font-semibold line-clamp-2 mb-2 ${isOutOfStock ? 'text-gray-500' : 'text-gray-900'}`} title={item.title}>
                                {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm flex-1 line-clamp-3 mb-4">
                                {item.description}
                            </p>

                            <div className="pt-2 border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`font-bold text-xl ${isOutOfStock ? 'text-gray-400' : 'text-indigo-600'}`}>
                                        ${item.price}
                                    </div>
                                    <div className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-gray-500'}`}>
                                        {isOutOfStock ? 'Out of Stock' : `Qty: ${item.quantity || 0}`}
                                    </div> 
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => !isOutOfStock && addToCart(item)}
                                        disabled={isOutOfStock}
                                        className={`flex-1 px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isOutOfStock
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
                                        }`}
                                    >
                                        {isOutOfStock ? 'Out of Stock' : 'Add to cart'}
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Add to wishlist"
                                        onClick={() => !isOutOfStock && addToWishlist(item)}
                                        disabled={isOutOfStock}
                                        className={`px-3 py-2 rounded-md transition-colors ${
                                            isOutOfStock
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200'
                                        }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                )})}
            </div>
        </section>
    )
}

export default Cards