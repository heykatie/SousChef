import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPets, createPet, deletePet, updatePet } from '../../redux/pets';
import AboutPet from '../../forms/AboutPet';
import OpenModalButton from '../../context/OpenModalButton';
import pupGif from '/images/icons/pup.gif';
import './Pets.css';

const Pets = () => {
	const dispatch = useDispatch();
	const { pets, status, error } = useSelector((state) => state.pets);
	const user = useSelector((state) => state.session.user);
	const [petToEdit, setPetToEdit] = useState(null);

	useEffect(() => {
		dispatch(getPets());
	}, [dispatch]);

	const handleAddPet = async (petData) => {
		await dispatch(createPet(petData));
		dispatch(getPets());
	};

	const handleDeletePet = async (petId) => {
		await dispatch(deletePet(petId));
		dispatch(getPets());
	};

	// const handlePetUpdate = async (updatedPetData) => {
	// 	if (updatedPetData.id) {
	// 		await dispatch(updatePet(updatedPetData));
	// 		dispatch(getPets());
	// 	}
	// };

	const handlePetUpdate = async (updatedPetData) => {
		if (!updatedPetData.id) return;

		console.log('Dispatching updatePet:', updatedPetData); // ✅ Debugging: Ensure correct data

		const result = await dispatch(updatePet(updatedPetData));
		if (result.error) {
			console.error('Update failed:', result.error);
		} else {
			dispatch(getPets()); // ✅ Only refetch if update succeeds
		}
	};

	return (
		<div className='pets-container'>
			<h2>My Pets</h2>

			<OpenModalButton
				buttonText='+ Add Pet'
				modalComponent={<AboutPet onUpdate={handleAddPet} mode='add' />}
			/>

			{status === 'loading' && <p>Loading pets...</p>}

			{pets.length === 0 ? (
				<p>No pets added yet.</p>
			) : (
				<ul className='pet-list'>
					{pets.map((pet) => (
						<li key={pet.id} className='pet-card'>
							<img src={pupGif || pet?.image} alt={pet.name} />
							<h3>{pet.name}</h3>
							<p>
								{pet.species} - {pet.breed}
							</p>
							<p>
								Age: {pet.age} | Weight: {pet.weight} lbs
							</p>
							<p>Allergies: {pet.allergies || 'None'}</p>
							<p>Notes: {pet.notes || 'No notes'}</p>
							<div className='pet-actions'>
								<OpenModalButton
									buttonText='Edit'
									onClick={() => {
										setPetToEdit(pet);
									}}
									modalComponent={
										<AboutPet
											onUpdate={(updatedData) =>
												handlePetUpdate(updatedData)
											}
											initialData={pet}
											mode='edit'
										/>
									}
								/>
								<button
									onClick={() => handleDeletePet(pet.id)}
									className='delete-btn'>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Pets;
