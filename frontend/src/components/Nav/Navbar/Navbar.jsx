import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import AvatarButton from '../AvatarButton';
import Menu from '../Menu';
import Sidebar from '../Sidebar';
import OpenModal from '../../../context/OpenModal';
import LoginModal from '../../Auth/Modals/LoginModal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Navbar.css';

const Navbar = () => {
	const ulRef = useRef();
	const user = useSelector((state) => state.session.user);
	const [isExpanded, setIsExpanded] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	const toggleSidebar = () => {
		setIsExpanded((prev) => !prev);
	};

	const toggleMenu = () => {
		setShowMenu((prev) => !prev);
	};

	// useEffect(() => {
	// 	if (!isExpanded) return;

	// 	const closeMenu = (e) => {
	// 		if (ulRef.current && !ulRef.current.contains(e.target)) {
	// 			setIsExpanded(false);
	// 		}
	// 	};

	// 	document.addEventListener('click', closeMenu);

	// 	return () => document.removeEventListener('click', closeMenu);
	// }, [isExpanded]);

	return (
		<>
			<nav className='top-navbar'>
				<div className='navbar-left'>
					<button
						aria-label='navbar-menu-btn'
						className='navbar-menu-btn'
						onClick={toggleSidebar}>
						<i className='fa-solid fa-hamburger'></i>
					</button>
					<NavLink to='/' className='logo'>
						<img src='/images/logo.png' alt='SousChef Logo' />
					</NavLink>
					<NavLink to='/' className='logo'>
						SousChef
					</NavLink>
				</div>

				<div className='navbar-center'>
					<input type='text' placeholder='Search' className='search-bar' />
					<button aria-label='search-btn' className='search-btn'>
						<i className='fas fa-search'></i>
					</button>
				</div>

				<div className='navbar-right'>
					{user ? (
						<AvatarButton />
					) : (
						<OpenModal
							itemText='Log In'
							onItemClick={toggleSidebar}
							modalComponent={<LoginModal />}
						/>
					)}
				</div>
			</nav>

			<button
				className={`expand-arrow ${showMenu ? 'rotated' : ''}`}
				onClick={toggleMenu}
				aria-label='Toggle Sidebar'>
				<i className='fa-solid fa-chevron-right'></i>
			</button>

			<Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
			{showMenu && <Menu showMenu={showMenu} toggleMenu={toggleMenu} />}
		</>
	);
};

export default Navbar;
