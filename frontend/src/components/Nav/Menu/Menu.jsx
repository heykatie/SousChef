import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import './Menu.css';

const Menu = ({
	showMenu,
	handleMouseEnter,
	isHovered,
	toggleMenu,
	handleMouseLeave,
	setIsHovered,
}) => {
	const userId = useSelector((state) => state.session?.user?.id);
	const menuRef = useRef(null);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') toggleMenu();
		};

		const handleClickOutside = (e) => {
			if (!menuRef.current || !e.target) return;

			setIsHovered(false);
			handleMouseLeave();
		};

		if (showMenu) {
			document.addEventListener('keydown', handleKeyDown);
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showMenu, toggleMenu, handleMouseLeave, setIsHovered]);

	return (
		<div
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			ref={menuRef}
			className={`menu ${isHovered || showMenu ? '' : 'hidden'} `}>
			{/* <NavLink to='/dash' className='menu-navLink'>
				<i className='fa-solid fa-house'></i>
			</NavLink> */}
			<NavLink to='/recipes' className='menu-navLink'>
				<i className='fa-solid fa-book'></i>
			</NavLink>
			<NavLink to={`/favorites`} className='menu-navLink'>
				<i className='fa-solid fa-heart'></i>
			</NavLink>
			<NavLink to='/recipes/new' className='menu-navLink'>
				<i className='fa-solid fa-pen'></i>
			</NavLink>
			<NavLink to={`/${userId}/recipes`} className='menu-navLink'>
				<i className='fa-solid fa-bookmark'></i>
			</NavLink>
			<NavLink to='/lists' className='menu-navLink'>
				<i className='fa-solid fa-list'></i>
			</NavLink>
		</div>
	);
};

export default Menu;
