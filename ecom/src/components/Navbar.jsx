import { useState, useRef, useEffect } from "react"
import { useAppContext } from '../context/AppContext'
import { Link, useNavigate } from 'react-router-dom'

// Profile Dropdown


const ProfileDropDown = (props) => {
    const { user, signOutUser, cartCount } = useAppContext()
    const navigate = useNavigate()

    const [state, setState] = useState(false)
    const profileRef = useRef()

    const navigation = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Log out", action: 'logout' },
    ]

    useEffect(() => {
        const handleDropDown = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setState(false)
        }
        document.addEventListener('click', handleDropDown)
        return () => document.removeEventListener('click', handleDropDown)
    }, [])

    const handleNavItem = async (item) => {
        if (item.action === 'logout') {
            await signOutUser()
            navigate('/login')
            return
        }
        navigate(item.path)
    }

    return (
        <div className={`relative ${props.className || ''}`}>
            <div className="flex items-center space-x-4">
                <div className="hidden lg:block" >{user?.displayName || 'Guest'}</div>
                <button ref={profileRef} className="w-10 h-10 outline-none rounded-full ring-offset-2 ring-gray-200 ring-2 lg:focus:ring-indigo-600"
                    onClick={() => setState(!state)}
                >
                    <img
                        src={'https://www.gravatar.com/avatar?d=mp'}
                        className="w-full h-full rounded-full object-cover"
                        alt={user?.displayName || user?.email || 'User avatar'}
                    />
                </button>
                <div className="lg:hidden">
                    <span className="block">{user?.displayName || 'Guest'}</span>
                    <span className="block text-sm text-gray-500">{user?.email || ''}</span>
                </div>
            </div>
            <ul className={`bg-white top-12 right-0 mt-5 space-y-5 lg:absolute lg:border lg:rounded-md lg:text-sm lg:w-52 lg:shadow-md lg:space-y-0 lg:mt-0 ${state ? '' : 'lg:hidden'}`}>
                {
                    navigation.map((item, idx) => (
                        <li key={idx}>
                            <button onClick={() => handleNavItem(item)} className="w-full text-left block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5" >
                                {item.title}
                                {item.title === "Dashboard" && cartCount > 0 && (
                                    <span className="ml-2 bg-red-500 text-white rounded-full text-xs px-2 py-1 font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default () => {

    const [menuState, setMenuState] = useState(false)
    const { cartCount } = useAppContext()

    return (
        <nav className="bg-white shadow-md">
            <div className="flex items-center space-x-8 py-3 px-4 max-w-screen-xl mx-auto md:px-8">
                <div className="flex-none lg:flex-initial">
                    <Link to="/">
                      <h1 className="text-lg font-semibold">E-Commerce</h1>
                    </Link>
                </div>
                <div className="flex-1 flex items-center justify-between">
                    <div className={`bg-white absolute z-20 w-full top-16 left-0 p-4 border-b lg:static lg:block lg:border-none ${menuState ? '' : 'hidden'}`}>

                        <ProfileDropDown
                            className="mt-5 pt-5 border-t lg:hidden"
                        />
                    </div>
                    <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-6">


                        <ProfileDropDown
                            className="hidden lg:block"
                        />
                        <button
                            className="outline-none text-gray-400 block lg:hidden"
                            onClick={() => setMenuState(!menuState)}
                        >
                            {
                                menuState ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}