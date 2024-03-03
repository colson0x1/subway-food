import { useContext } from 'react';
import Modal from './UI/Modal';
import CartContext from '../store/CartContext';
import { currencyFormatter } from '../util/formatting';
import Input from './UI/Input';
import Button from './UI/Button';
import UserProgressContext from '../store/UserProgressContext';

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0,
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    // convert form data object to simpler javascript object where form
    // inputs are represented by their names as their property names and
    // their entered value are the values for those properties by using
    // Object.fromEntries and passing form data entries to it
    // this gives: { email: abc@xyz.com } like that for all other inputs too
    // hence we get all the form input fields in key value pair
    const customerData = Object.fromEntries(fd.entries());

    // send that data customerData along with the cart data to the backend
    // Since this is the request that changes something on the backend,
    // we dont necessarily have to await for the response here
    // It will just hit the backend and there this data can be extracted and stored
    fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      }),
    });
  }

  return (
    <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input label='Full Name' type='text' id='name' />
        <Input label='Email Address' type='email' id='email' />
        <Input lable='Street' type='text' id='street' />
        <div className='control-row'>
          <Input label='Postal Code' id='postal-code' />
          <Input label='City' type='text' id='city' />
        </div>

        <p className='modal-actions'>
          <Button type='button' textOnly onClick={handleClose}>
            Close
          </Button>
          <Button>Submit Order</Button>
        </p>
      </form>
    </Modal>
  );
}
