import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipe, deleteRecipe } from '../../redux/recipes';
import './Recipe.css';

const Recipe = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.session.user);
	const recipe = useSelector((state) => state.recipes.selectedRecipe);

	useEffect(() => {
		dispatch(fetchRecipe(id));
	}, [dispatch, id]);

	const handleDelete = async () => {
		if (window.confirm('Are you sure you want to delete this recipe?')) {
			await dispatch(deleteRecipe(id));
			navigate('/recipes');
		}
	};

	if (!recipe) return <p className='no-recipe'>Recipe not found.</p>;

	return (
		<div className='recipe-container'>
			<button className='back-btn' onClick={() => navigate('/recipes')}>
				← Back to Recipes
			</button>
			{user?.id === recipe.userId && (
				<div className='recipe-actions'>
					<button
						className='edit-btn'
						onClick={() => navigate(`/recipes/${id}/edit`)}>
						Edit Recipe
					</button>
					<button className='delete-btn' onClick={handleDelete}>
						Delete Recipe
					</button>
				</div>
			)}
			<h1 className='recipe-title'>{recipe.title}</h1>
			<p className='recipe-likes'>❤️ {recipe.likesCount} Likes</p>
			<p className='recipe-rating'>Rating: {recipe.rating} / 5 ⭐</p>
			<img
				src={'/images/recipes/dogfood.jpeg' || recipe.imageUrl}
				alt={recipe.title}
				className='recipe-image'
			/>
			<p className='recipe-category'>Category: {recipe.category}</p>
			<p className='recipe-difficulty'>Difficulty: {recipe.difficulty}</p>
			<p className='recipe-description'>{recipe.description}</p>
			<div className='recipe-section'>
				<h2>Ingredients</h2>
				<p className='recipe-servings'>Servings: {recipe.servings}</p>
				<ul className='recipe-ingredients'>
					{recipe.ingredients?.map((ingredient, index) => (
						<li key={index}>
							{ingredient.quantity} {ingredient.name}
						</li>
					))}
				</ul>
			</div>
			<div className='recipe-section'>
				<p className='recipe-time'>
					Prep: {recipe.prepTime} min | Cook: {recipe.cookTime} min |
					Total: {recipe.totalTime} min
				</p>
				<h2>Instructions</h2>
				<ol className='recipe-instructions'>
					{(() => {
						try {
							const steps = Array.isArray(recipe.instructions)
								? recipe.instructions
								: JSON.parse(recipe.instructions);

							return steps.map((step, index) => (
								<li key={index}>{`${index + 1}. ${step}`}</li>
							));
						} catch (error) {
							return <p>Error displaying instructions.</p>;
						}
					})()}
				</ol>
			</div>
			<div className='recipe-section'>
				<h2>Nutrition Facts (Per Recipe)</h2>
				<ul className='recipe-nutrition'>
					<li>Calories: {recipe.nutritionTotals?.calories} kcal</li>
					<li>Carbohydrates: {recipe.nutritionTotals?.carbohydrates} g</li>
					<li>Protein: {recipe.nutritionTotals?.protein} g</li>
					<li>Fats: {recipe.nutritionTotals?.fats} g</li>
					<li>Fiber: {recipe.nutritionTotals?.fiber} g</li>
					<li>Sodium: {recipe.nutritionTotals?.sodium} mg</li>
					<li>Sugar: {recipe.nutritionTotals?.sugar} g</li>
					<li>Calcium: {recipe.nutritionTotals?.calcium} mg</li>
					<li>Iron: {recipe.nutritionTotals?.iron} mg</li>
					<li>Moisture: {recipe.nutritionTotals?.moisture} %</li>
				</ul>
			</div>
			{recipe.notes && (
				<div className='recipe-section'>
					<h2>Notes</h2>
					<p className='recipe-notes'>{recipe.notes}</p>
				</div>
			)}
		</div>
	);
};

export default Recipe;
