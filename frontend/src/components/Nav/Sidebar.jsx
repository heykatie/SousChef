import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import './Sidebar.css';

const Sidebar = ({ showMenu, toggleMenu }) => {
	const userId = useSelector(state => state.session.userId);
	const sidebarRef = useRef(null);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				toggleMenu();
			}
		};

		const handleClickOutside = (e) => {
			const menuButton = document.querySelector('.navbar-menu-btn');

			if (menuButton && menuButton.contains(e.target)) {
				return;
			}

			if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
				toggleMenu();
			}
		};

		if (showMenu) {
			document.addEventListener('keydown', handleKeyDown);
			document.addEventListener('click', handleClickOutside);
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('click', handleClickOutside);
		};
	}, [showMenu, toggleMenu]);

	return (
		<>
			<div className={`sidebar ${showMenu ? 'hidden' : ''}`}>
				<NavLink to='/dashboard' className='sidebar-navLink'>
					<i className='fa-solid fa-house'></i>
				</NavLink>
				<NavLink to='/recipes' className='sidebar-navLink'>
					<i className='fa-solid fa-book'></i>
				</NavLink>
				<NavLink to={`/favorites`} className='sidebar-navLink'>
					<i className='fa-solid fa-heart'></i>
				</NavLink>
				<NavLink to='/recipes/new' className='sidebar-navLink'>
					<i className='fa-solid fa-pen'></i>
				</NavLink>
				<NavLink to={`/recipes/${userId}`} className='sidebar-navLink'>
					<i className='fa-solid fa-bookmark'></i>
				</NavLink>
				<NavLink to='/lists' className='sidebar-navLink'>
					<i className='fa-solid fa-list'></i>
				</NavLink>
			</div>

			<div
				ref={sidebarRef}
				className={`sidebar-panel ${showMenu ? 'expanded' : ''}`}>
				<button
					aria-label='close-btn'
					className='close-btn'
					onClick={toggleMenu}>
					<i className='fa-solid fa-xmark'></i>
				</button>
				<NavLink
					to='/dashboard'
					onClick={toggleMenu}
					className='sidebar-navLink'>
					<i className='fa-solid fa-house'></i>{' '}
					<span className='text'>Home</span>
				</NavLink>
				<NavLink
					to='/recipes'
					onClick={toggleMenu}
					className='sidebar-navLink'>
					<i className='fa-solid fa-book'></i>{' '}
					<span className='text'>Explore</span>
				</NavLink>
				<NavLink
					to='/favorites'
					onClick={toggleMenu}
					className='sidebar-navLink'>
					<i className='fa-solid fa-heart'></i>{' '}
					<span className='text'>My Favorites</span>
				</NavLink>
				<NavLink
					to='/recipes/new'
					onClick={toggleMenu}
					className='sidebar-navLink'>
					<i className='fa-solid fa-pen'></i>{' '}
					<span className='text'>Post a Recipe</span>
				</NavLink>
				<NavLink
					to={`/recipes/${userId}`}
					onClick={toggleMenu}
					className='sidebar-navLink'>
					<i className='fa-solid fa-bookmark'></i>{' '}
					<span className='text'>My Recipes</span>
				</NavLink>
				<NavLink
					to='/lists'
					onClick={toggleMenu}
					className='sidebar-navLink'>
					<i className='fa-solid fa-list'></i>{' '}
					<span className='text'>Lists</span>
				</NavLink>
			</div>
		</>
	);
};

export default Sidebar;