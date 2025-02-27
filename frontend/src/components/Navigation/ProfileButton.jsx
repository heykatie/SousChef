import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton() {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);
	const user = useSelector((store) => store.session.user);
	const ulRef = useRef();

	const toggleMenu = (e) => {
		e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
		setShowMenu(!showMenu);
	};

	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = (e) => {
			if (ulRef.current && !ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		};

		document.addEventListener('click', closeMenu);

		return () => document.removeEventListener('click', closeMenu);
	}, [showMenu]);

	const closeMenu = () => setShowMenu(false);

	const handleLogout = (e) => {
		e.preventDefault();
		dispatch(logout());
		closeMenu();
	};

	return (
		<>
			<button onClick={toggleMenu} aria-label='profile menu'>
				<i className='fas fa-user-circle' />
			</button>
			{showMenu && (
				<ul className={'profile-dropdown'} ref={ulRef}>
					{user ? (
						<>
							<li>{user.username}</li>
							<li>{user.email}</li>
							<li>
								<button onClick={handleLogout}>Log Out</button>
							</li>
						</>
					) : (
						<>
							<OpenModalMenuItem
								itemText='Log In'
								onItemClick={closeMenu}
								modalComponent={<LoginFormModal />}
							/>
							<OpenModalMenuItem
								itemText='Sign Up'
								onItemClick={closeMenu}
								modalComponent={<SignupFormModal />}
							/>
						</>
					)}
				</ul>
			)}
		</>
	);
}

export default ProfileButton;
