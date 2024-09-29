import { useRef, useEffect, useState } from 'react'
import logo from '../../assets/images/logo.png'
import userImg from '../../assets/images/avatar-icon.png'
import { NavLink, Link } from 'react-router-dom'
import { BiMenu } from 'react-icons/bi'

const navLinks = [
    {
        path: '/',
        display: 'Home'
    },
    {
        path: '/services',
        display: 'Services'
    },
    {
        path: '/doctors',
        display: 'Find Doctors'
    },
    {
        path: '/contact',
        display: 'Contact'
    },
]

const Header = () => {
    const headerRef = useRef(null)
    const [menuOpen, setMenuOpen] = useState(false)

    // Handle sticky header on scroll
    const handleStickyHeader = () => {
        if (window.scrollY > 80) {
            headerRef.current.classList.add('sticky__header')
        } else {
            headerRef.current.classList.remove('sticky__header')
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleStickyHeader)
        return () => {
            window.removeEventListener('scroll', handleStickyHeader)
        }
    }, [])

    // Toggle menu visibility
    const toggleMenu = () => { 
        setMenuOpen(prev => !prev)
    } 

    // Close menu when a navigation link is clicked
    const closeMenu = () => {
        setMenuOpen(false)
    }

    return (
        <header className='header flex items-center' ref={headerRef}>
            <div className="container">
                <div className='flex items-center justify-between'>
                    {/*-- Logo -->*/}
                    <div className="logo">
                        <Link to='/'><img src={logo} alt="Logo" /></Link>
                    </div>
                    {/*-- Navigation -->*/}
                    <div className={`navigation ${menuOpen ? 'show__menu' : ''}`}>
                        <ul className='menu flex flex-col md:flex-row items-center gap-6 md:gap-12'>
                            {navLinks.map((link, index) => (
                                <li key={index} onClick={closeMenu}>
                                    <NavLink 
                                        to={link.path} 
                                        className={({ isActive }) => 
                                            isActive
                                                ? "text-primaryColor text-lg font-semibold"
                                                : "text-textColor text-lg font-medium hover:text-primaryColor"
                                        }
                                    >
                                        {link.display}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/*-- User & Log in -->*/}
                    <div className='flex items-center gap-4'>
                        {/* 
                            When the user is logged in, you can conditionally render the user image.
                            Uncomment and modify the following block as needed:
                            <div>
                                <Link to='/'>
                                    <figure>
                                        <img
                                            src={userImg}
                                            className="w-10 h-10 rounded-full"
                                            alt="User"
                                        />
                                    </figure>
                                </Link>
                            </div>
                        */}

                        <Link to='/login'>
                            <button className='bg-primaryColor py-2 px-6 text-white font-semibold h-11 flex items-center justify-center rounded-full transition-transform duration-100 ease-in-out active:scale-95 active:bg-blue-700'>
                                Login
                            </button>
                        </Link>

                        {/* Menu Toggle Button */}
                        <span className='md:hidden' onClick={toggleMenu}>
                            <BiMenu className="w-6 h-6 cursor-pointer" />
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
