import { useParams } from 'react-router';

import { getSneakerDetails } from '../services/apiSneakers';
import Button from '../ui/Button';
import { formatCurrency } from '../utils/helpers';
import TextExpander from '../utils/textExpander';
import { useDispatch, useSelector } from 'react-redux';
import { addItems, getCurrentQuantityById } from '../features/cart/cartSlice';
import UpdateItemQuantity from '../features/cart/UpdateItemQuantity';
import DeleteItem from '../features/cart/DeleteItem';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Loader from '../ui/Loader';
import SimilarProducts from '../ui/SimilarProducts';
import 'react-toastify/dist/ReactToastify.css';
import ShippingInfoCard from '../ui/ShippingInfoCard';

function SneakerDetails() {
  // useparams, we use this to read the parameter from the URl
  const { id } = useParams();

  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const dispatch = useDispatch();
  // useQuery, we use this to fetch the data from the server
  const {
    data: sneakerDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sneakerDetails', id],
    queryFn: () => getSneakerDetails(id),
  });
  if (isLoading) return <Loader />;

  if (error) return <p>Error:{error.message}</p>; // show an error message if no sneaker

  const isInCart = currentQuantity > 0;

  const { name, image, shoeInfo, price, colorShown, style } = sneakerDetails;

  function handleAddToCart() {
    const newItem = {
      id,
      image,
      name,
      quantity: 1,
      price,
      totalPrice: price * 1,
    };
    dispatch(addItems(newItem));
    toast.success('Item added to cart', { autoClose: 2000 });
  }

  return (
    <>
      <div className="mx-auto my-8 grid grid-cols-[1fr-auto] gap-4 md:grid-cols-[auto_1fr_auto] md:gap-4">
        <img src={image} alt={name} className="w-48 md:w-96" />
        <div className="h-[350px] space-y-4 ">
          <h2 className="text-lg font-bold sm:text-2xl">
            {sneakerDetails.name}
          </h2>
          <TextExpander
            data-test={`text-expander-${sneakerDetails.id}`}
            collapsedNumWords={30}
            expandButtonText="Show more"
            collapseButtonText="Show less"
            text={shoeInfo}
            className={'text-sm sm:text-base'}
          ></TextExpander>
          <p className="text-sm  font-semibold sm:text-base">
            Shown: {colorShown}
          </p>
          <p className="text-sm  font-semibold sm:text-base">Style: {style}</p>
          <div className="mt-auto flex items-center justify-between">
            <p>{formatCurrency(price)}</p>

            {isInCart && (
              <div className="flex items-center gap-3 sm:gap-8">
                <UpdateItemQuantity
                  sneakerId={id}
                  currentQuantity={currentQuantity}
                />
                <DeleteItem sneakerId={id} />
              </div>
            )}
            {!isInCart && (
              <Button
                data-test="add-to-cart"
                type="small"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
        <ShippingInfoCard />
      </div>
      <SimilarProducts />
    </>
  );
}

export default SneakerDetails;
