import React from 'react';
import CatalogGrid from "../componentes/Public/CatalogGrid";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FiShoppingCart } from 'react-icons/fi';
import CartDropdown from '../componentes/Public/CartDropdown';

const PublicCatalog = () => {
    const [showCart, setShowCart] = useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        if (!cart.some(item => item.id === product.id)) {
            setCart([...cart, product]);
        }
    };
    
    const removeFromCart = (productId) => {
        setCart(prevCart => {
            const newCart = prevCart.filter(item => item.id !== productId);
            console.log("Carrito actualizado:", newCart); // ✅ Verifica en consola
            return newCart;
        });
    };

    const generateWhatsAppMessage = () => {
        if (cart.length === 0) {
            return encodeURIComponent("Hola, le escribo por los artículos de IreneShop.");
        }
        const items = cart.map(item => `- ${item.name}`).join('\n');
        return encodeURIComponent(`Hola, estoy interesad@ en:\n${items}`);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*');
        if (!error) setProducts(data);
        };

        fetchProducts()
    }, []);
    return (
        <div className="min-h-screen bg-pink-50 p-4">
            <div className="fixed top-4 right-4 z-50">
                <button 
                    onClick={() => setShowCart(!showCart)}
                    className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow relative"
                >
                    <FiShoppingCart size={24} className="text-blue-500" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {cart.length}
                        </span>
                    )}
                </button>
                
                {showCart && (
                    <CartDropdown 
                        cart={cart}
                        removeFromCart={removeFromCart}
                        onClose={() => setShowCart(false)}
                        generateWhatsAppMessage={generateWhatsAppMessage}
                    />
                )}
            </div>
            <div className='fixed bottom-2 right-2 '>
                <a 
                    href={`https://wa.me/+5355879391?text=${generateWhatsAppMessage()}`} 
                    target="_blank" 
                    rel="noreferrer"
                >
                        <button>
                            <img className='rounded-full w-16 h-16 shadow-lg cursor-pointer' src={require("../assets/logoWhatsApp.png")} alt="Contactar por Whatsapp"/>
                        </button>
                </a>
            </div>
            <div className="flex justify-center animate-fade-in">
                <div className="max-w-[100px] md:max-w-[100px] transition-transform duration-300 hover:scale-105">
                    {/* Reemplaza 'logo-fajas-irene.png' con el nombre de tu archivo */}
                    <img 
                        src={require("../assets/logo1Pink.jpg")}
                        alt="Logo de Fajas Irene"
                        className="w-full h-auto rounded-lg object-contain"
                    />
                </div>
            </div>
            <h1 className="text-4xl font-greatvibes text-pink-600 text-center mb-8">Irene's Shapes</h1>
            <CatalogGrid 
            products={products} 
            addToCart={addToCart} 
            removeFromCart={removeFromCart} 
            cart={cart}
            />
        </div>
    );
}

export default PublicCatalog;