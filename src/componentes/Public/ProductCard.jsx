import { supabase } from "../../lib/supabaseClient";
import { FiPlus, FiMinus } from 'react-icons/fi';

const ProductCard = ({ product, addToCart, removeFromCart, cart }) => {
    const isInCart = cart.some(item => item.id === product.id);

    const handleCartAction = () => {
        if (isInCart) {
            removeFromCart(product.id);
        } else {
            addToCart(product);
        }
    };
    
    const imageUrl = supabase.storage
        .from('product-images')
        .getPublicUrl(product.image_url).data.publicUrl;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <div className="flex-grow mb-4 max-h-24"> {/* Altura máxima para la descripción */}
                    <p className="text-gray-600 text-sm">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-auto"> {/* mt-auto empuja hacia abajo */}
                    <button 
                        onClick={handleCartAction}
                        className={`p-2 rounded-full transition-colors duration-200 ${
                            isInCart ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                        }`}
                    >
                        {isInCart ? <FiMinus size={20} /> : <FiPlus size={20} />}
                    </button>
                    <span className="text-lg font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;