import React, { useEffect, useState } from 'react';

import classes from './AvailableMeals.module.css';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import useHttp from '../../hooks/use-http';

const AvailableMeals = () => {
	const [ meals, setMeals ] = useState([]);

	const { isLoading, error, sendRequest: fetchMeals } = useHttp();

	useEffect(
		() => {
			const transformMeals = (mealObj) => {
				const loadedMeals = [];
				for (const mealKey in mealObj) {
					loadedMeals.push({
						id: mealKey,
						name: mealObj[mealKey].name,
						description: mealObj[mealKey].description,
						price: mealObj[mealKey].price
					});
				}

				setMeals(loadedMeals);
			};

			fetchMeals(
				{ url: 'https://react-http-88f71-default-rtdb.europe-west1.firebasedatabase.app/meals.json' },
				transformMeals
			);
		},
		[ fetchMeals ]
	);

	let mealsList = <h2>No meals found.</h2>;

	if (meals.length > 0) {
		mealsList = (
			<ul>
				{meals.map((meal) => (
					<MealItem key={meal.id} id={meal.id} name={meal.name} description={meal.description} price={meal.price} />
				))}
			</ul>
		);
	}

	let content = mealsList;

	if (error) {
		content = (
			<React.Fragment>
				<p className={classes.message}>{error}</p>
				<button className={classes.button} onClick={fetchMeals}>
					Try again
				</button>
			</React.Fragment>
		);
	}

	if (isLoading) {
		content = <p className={classes.message}>Loading meals...</p>;
	}

	return (
		<section className={classes.meals}>
			<div className={classes.meals}>
				<Card>{content}</Card>
			</div>
		</section>
	);
};

export default AvailableMeals;
