import { FiShoppingCart, FiX } from 'react-icons/fi';

const CartDropdown = ({ cart, removeFromCart, onClose, generateWhatsAppMessage }) => {
    return (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl z-50">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold flex items-center">
                    <FiShoppingCart className="mr-2" /> Carrito ({cart.length})
                </h3>
                <button onClick={onClose} className="text-gray-500">
                    <FiX size={18} />
                </button>
            </div>
            
            {cart.length === 0 ? (
                <p className="p-4 text-gray-500">El carrito está vacío</p>
            ) : (
                <div className="max-h-64 overflow-y-auto">
                    {cart.map(item => (
                        <div key={item.id} className="p-4 border-b flex justify-between items-center">
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                            </div>
                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FiX size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {cart.length > 0 && (
                <div className="p-4 bg-gray-50">
                    <a
                        href={`https://wa.me/+5355879391?text=${generateWhatsAppMessage(cart)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-green-600"
                    >
                        <FiShoppingCart className="mr-2" />
                        Enviar por WhatsApp
                    </a>
                </div>
            )}
        </div>
    );
};

export default CartDropdown