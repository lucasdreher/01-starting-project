import React, { useContext, useState } from 'react';

import classes from './Cart.module.css';
import Modal from '../UI/Modal';
import CartContext from '../../store/cart-context';
import CartItem from './CartItem';
import Checkout from './Checkout';
import useHttp from '../../hooks/use-http';

const Cart = (props) => {
	const { isLoading, error, sendRequest: sendOrderRequest } = useHttp();
	const [ isCheckout, setIsCheckout ] = useState(false);
	const [ isSubmitting, setIsSubmitting ] = useState(false); //TODO see if isLoading does the same thing
	const [ didSubmit, setDidSubmit ] = useState(false);

	const cartCtx = useContext(CartContext);
	const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
	const hasItems = cartCtx.items.length > 0;

	const cartItemRemoveHandler = (id) => {
		cartCtx.removeItem(id);
	};

	const cartItemAddHandler = (item) => {
		cartCtx.addItem({ ...item, amount: 1 });
	};

	const orderHandler = () => {
		setIsCheckout(true);
	};

	const submitOrderHandler = async (userData) => {
		setIsSubmitting(true);
		await sendOrderRequest({
			url: 'https://react-http-88f71-default-rtdb.europe-west1.firebasedatabase.app/orders.json',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: {
				user: userData,
				orderedItems: cartCtx.items
			}
		});
		setIsSubmitting(false);
		if (!error) {
			setDidSubmit(true);
			cartCtx.clearCart();
		}
	};

	const cartItems = (
		<ul className={classes['cart-items']}>
			{cartCtx.items.map((item) => (
				<CartItem
					key={item.id}
					name={item.name}
					amount={item.amount}
					price={item.price}
					onRemove={cartItemRemoveHandler.bind(null, item.id)}
					onAdd={cartItemAddHandler.bind(null, item)}
				/>
			))}
		</ul>
	);

	const modalActions = (
		<div className={classes.actions}>
			<button className={classes['button--alt']} onClick={props.onClose}>
				Close
			</button>
			{hasItems && (
				<button className={classes.button} onClick={orderHandler}>
					Order
				</button>
			)}
		</div>
	);

	const cartModalContent = (
		<React.Fragment>
			{cartItems}
			<div className={classes.total}>
				<span>Total Amount</span>
				<span>{totalAmount}</span>
			</div>
			{isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
			{!isCheckout && modalActions}
		</React.Fragment>
	);

	const isSubmittingOrderContent = <p>Sending order data...</p>;
	const didSubmitOrderContent = (
		<React.Fragment>
			<p>Successfully sent the order</p>
			<div className={classes.actions}>
				<button className={classes.button} onClick={props.onClose}>
					Close
				</button>
			</div>
		</React.Fragment>
	);

	const errorSubmittingOrderContent = <p>Sending order data fail, {error}</p>;

	return (
		<Modal onClose={props.onClose}>
			{!isSubmitting && !didSubmit && !error && cartModalContent}
			{isSubmitting && isSubmittingOrderContent}
			{!isSubmitting && didSubmit && didSubmitOrderContent}
			{!didSubmit && error && errorSubmittingOrderContent}
		</Modal>
	);
};

export default Cart;
