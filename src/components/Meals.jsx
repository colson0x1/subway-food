import MealItem from './MealItem';
import useHttp from '../hooks/useHttp';

// creating this object once when this file is parsed for the first time
// then after in the component function, we're always using the same object
// in memory. Thus prevents infinite rerenders!
const requestConfig = {};

export default function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp('http://localhost:3000/meals', requestConfig, []);

  console.log('loadedMeals', loadedMeals);

  if (isLoading) {
    return <p>Fetching meals...</p>;
  }

  // alternative to initialData approach
  // if (!data) {
  //  return <p>No meals found.</p>
  // }

  return (
    <ul id='meals'>
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
