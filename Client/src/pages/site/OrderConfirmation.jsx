import { useParams, Link } from "react-router-dom";

export default function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="max-w-container mx-auto px-4 md:px-8 py-24 text-center">
      <i className="fa-solid fa-circle-check text-5xl text-green-600 mb-6 block" />
      <h1 className="font-serif text-2xl md:text-3xl mb-3">Order Placed!</h1>
      <p className="text-primary/60 mb-2">
        Your order number is <strong className="text-primary">{orderNumber}</strong>
      </p>
      <p className="text-primary/60 mb-8 max-w-md mx-auto">
        We&apos;ve opened a WhatsApp chat with your order details. Confirm payment and delivery details there — our
        team will follow up shortly. You can also track this order any time using your order number and phone.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link to={`/track?orderNumber=${orderNumber}`} className="btn-primary">
          Track This Order
        </Link>
        <Link to="/" className="btn-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
