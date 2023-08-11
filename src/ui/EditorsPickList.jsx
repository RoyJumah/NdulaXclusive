import { useSneakers } from '../features/sneakers/useSneakers';

import EditorsPickItem from './EditorsPickItem';
import Loader from './Loader';

function EditorsPickList() {
  const { sneakers, isLoading } = useSneakers();
  const editorsPickSneakers = sneakers?.slice(0, 5);

  if (isLoading) return <Loader />;
  return (
    <div className="mt-6">
      <h1 className="text-base font-bold sm:mb-4 sm:text-xl">
        Featured Sneakers
      </h1>
      <ul className="grid grid-cols-5 gap-5">
        {editorsPickSneakers?.map((sneaker, i) => (
          <EditorsPickItem key={i} sneaker={sneaker} />
        ))}
      </ul>
    </div>
  );
}

export default EditorsPickList;
