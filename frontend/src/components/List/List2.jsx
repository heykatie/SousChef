import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchGroceryList,
	toggleChecked,
	saveListName,
	saveIngredient,
} from '../../redux/lists';

export default function List() {
	// const navigate = useNavigate();
	// const lists = useSelector((state) => state.lists.allLists);
	const { listId } = useParams();
	const dispatch = useDispatch();
	const groceryList = useSelector((state) =>
		state.lists?.allLists?.find((list) => list.id === Number(listId))
	);
	const [editingName, setEditingName] = useState(false);
	const [listName, setListName] = useState(groceryList?.name || '');
	const [checkedItems, setCheckedItems] = useState({});
	const [editingIngredientName, setEditingIngredientName] = useState(null);
	const [editingIngredientQuantity, setEditingIngredientQuantity] =
		useState(null);
	const [ingredientValues, setIngredientValues] = useState({});
	const [loading, setLoading] = useState(true);
	const inputRef = useRef(null);

	useEffect(() => {
		if (groceryList?.name) {
			setListName(groceryList.name);
		}
	}, [groceryList]);

	useEffect(() => {
		if (groceryList?.Ingredients) {
			const initialValues = groceryList.Ingredients.reduce((acc, item) => {
				acc[item.id] = {
					name: item.name ?? '', 
					quantity: item.quantity ?? '',
				};
				return acc;
			}, {});
			setIngredientValues(initialValues);
		}
	}, [groceryList]);

	// useEffect(() => {
	// 	if (listId) {
	// 		dispatch(fetchGroceryList(listId))
	// 			.unwrap()
	// 			.then(() => setLoading(false))
	// 			.catch(() => setLoading(false));
	// 	}
	// }, [dispatch, listId]);

	useEffect(() => {
		setLoading(true);
		dispatch(fetchGroceryList(listId))
			.unwrap()
			.finally(() => setLoading(false));
	}, [dispatch, listId]);

	const handleCheck = async (ingredientId) => {
		const newCheckedState = !checkedItems[ingredientId];

		setCheckedItems((prev) => ({
			...prev,
			[ingredientId]: newCheckedState,
		}));

		dispatch(
			toggleChecked({ listId, ingredientId, checked: newCheckedState })
		)
			.unwrap()
			.catch((error) =>
				console.error('  Error updating checked state:', error)
			);
	};

	useEffect(() => {
		const interval = setInterval(async () => {
			try {
				await Promise.all(
					Object.entries(checkedItems).map(([ingredientId, checked]) =>
						toggleChecked(listId, ingredientId, checked)
					)
				);
				// console.log('  Auto-saved all checked items');
			} catch (error) {
				console.error('  Error auto-saving list:', error);
			}
		}, 500000);

		return () => clearInterval(interval);
	}, [checkedItems, listId]);

	// const saveBeforeExit = async () => {
	// 	try {
	// 		await Promise.all(
	// 			Object.entries(checkedItems).map(([ingredientId, checked]) =>
	// 				toggleChecked(listId, ingredientId, checked)
	// 			)
	// 		);
	// 		console.log('  Auto-saved before exit');
	// 	} catch (error) {
	// 		console.error('  Error saving before exit:', error);
	// 	}
	// };

	// window.addEventListener('beforeunload', saveBeforeExit);
	// return () => window.removeEventListener('beforeunload', saveBeforeExit);
	useEffect(() => {
		const saveBeforeExit = () => {
			if (Object.keys(checkedItems).length > 0) {
				try {
					const url = `/api/lists/${listId}/bulk-update`;
					const data = JSON.stringify({ checkedItems });
					navigator.sendBeacon(url, data);
				} catch (error) {
					console.error('  Error saving before exit:', error);
				}
			}
		};

		window.addEventListener('beforeunload', saveBeforeExit);
		return () => window.removeEventListener('beforeunload', saveBeforeExit);
	}, [checkedItems, listId]);

	const saveList = async () => {};

	// useEffect(() => {
	// 	if (groceryList?.Ingredients) {
	// 		const initialValues = groceryList.Ingredients.reduce((acc, item) => {
	// 			acc[item.id] = { name: item.name, quantity: item.quantity };
	// 			return acc;
	// 		}, {});
	// 		setIngredientValues(initialValues);
	// 	}
	// }, [groceryList]);

	useEffect(() => {
		setIngredientValues((prev) => {
			const updatedValues = { ...prev };
			if (groceryList?.Ingredients) {
				groceryList.Ingredients.forEach((item) => {
					updatedValues[item.id] = {
						name: item.name,
						quantity: item.quantity,
					};
				});
			}
			return updatedValues;
		});
	}, [groceryList]);

	useEffect(() => {
		if (editingIngredientName === null && editingIngredientQuantity === null)
			return;

		const handleClickOutside = (event) => {
			const nameInput = document.getElementById(
				`ingredient-input-${editingIngredientName}`
			);
			const quantityInput = document.getElementById(
				`quantity-input-${editingIngredientQuantity}`
			);

			// If neither input is clicked, exit edit mode
			if (
				nameInput &&
				!nameInput.contains(event.target) &&
				quantityInput &&
				!quantityInput.contains(event.target)
			) {
				setEditingIngredientName(null);
				setEditingIngredientQuantity(null);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, [editingIngredientName, editingIngredientQuantity]);

	if (loading) return <p>Loading grocery list...</p>;
	if (!groceryList || !groceryList.id) {
		// console.error('  groceryList is undefined or missing ID:', groceryList);
		return <p>Error loading grocery list. Try refreshing.</p>;
	}

	return (
		<div className='list-container'>
			<h1 onClick={() => setEditingName(true)}>
				{editingName ? (
					<input
						type='text'
						value={listName}
						onChange={(e) => setListName(e.target.value)}
						onBlur={() => {
							if (!listName) {
								setListName(groceryList?.name || 'Untitled List');
							}
							dispatch(
								saveListName({
									listId,
									name: listName || 'Untitled List',
								})
							);
							setEditingName(false);
						}}
						autoFocus
					/>
				) : (
					listName
				)}
			</h1>
			<ul>
				{groceryList.Ingredients && groceryList.Ingredients.length > 0 ? (
					groceryList.Ingredients.map((item) => (
						<li key={item.id}>
							<label>
								<input
									type='checkbox'
									checked={checkedItems[item.id] || false}
									onChange={() => handleCheck(item.id)}
								/>
								<span
									onClick={() =>
										setTimeout(
											() => setEditingIngredientName(item.id),
											0
										)
									}>
									{editingIngredientName === item.id ? (
										<input
											ref={
												editingIngredientName === item.id
													? inputRef
													: null
											}
											id={`ingredient-input-${item.id}`}
											type='text'
											value={
												ingredientValues[item.id]?.name ?? 'n/a'
											}
											onChange={(e) =>
												setIngredientValues((prev) => ({
													...prev,
													[item.id]: {
														...prev[item.id],
														name: e.target.value,
													},
												}))
											}
											onBlur={() => {
												dispatch(
													saveIngredient({
														listId,
														ingredientId: item.id,
														name:
															ingredientValues[item.id]?.name ||
															item.name ||
															'n/a',
														quantity:
															ingredientValues[item.id]
																?.quantity ||
															item.quantity ||
															'0',
													})
												)
													.unwrap()
													.then((updatedIngredient) => {
														setIngredientValues((prev) => ({
															...prev,
															[updatedIngredient.ingredientId]: {
																name: updatedIngredient.name,
																quantity:
																	updatedIngredient.quantity,
															},
														}));
													})
													.catch((error) => {
														console.error(
															'  Failed to update ingredient:',
															error
														);
														alert(
															error ||
																'Error updating ingredient. Please try again.'
														);
													});
												setEditingIngredientName(null);
											}}
											autoFocus
										/>
									) : (
										item?.name
									)}
								</span>
								<span
									onClick={() =>
										setTimeout(
											() => setEditingIngredientQuantity(item.id),
											0
										)
									}>
									{editingIngredientQuantity === item.id ? (
										<input
											ref={
												editingIngredientQuantity === item.id
													? inputRef
													: null
											}
											id={`quantity-input-${item.id}`}
											type='text'
											value={ingredientValues[item.id]?.quantity}
											onChange={(e) =>
												setIngredientValues((prev) => ({
													...prev,
													[item.id]: {
														...prev[item.id],
														quantity: e.target.value,
													},
												}))
											}
											onBlur={() => {
												dispatch(
													saveIngredient({
														listId,
														ingredientId: item.id,
														quantity:
															ingredientValues[item.id]
																?.quantity || item.quantity, //   Only updating quantity
													})
												)
													.unwrap()
													.then((updatedIngredient) => {
														setIngredientValues((prev) => ({
															...prev,
															[updatedIngredient.ingredientId]: {
																name: item.name, //   Keep name from DB
																quantity:
																	updatedIngredient.quantity, //   Update quantity
															},
														}));
													})
													.catch((error) => {
														console.error(
															'  Failed to update ingredient:',
															error
														);
														alert(
															error ||
																'Error updating ingredient. Please try again.'
														);
													});
												setEditingIngredientQuantity(null);
											}}
											autoFocus
										/>
									) : (
										item.quantity
									)}
								</span>
							</label>
						</li>
					))
				) : (
					<p>No ingredients found for this list.</p>
				)}
			</ul>
			<button className='save-btn' onClick={saveList}>
				Save List
			</button>
		</div>
	);
}
