import ProductCard from "./ProductCard";

const CatalogGrid = ({ products, addToCart, removeFromCart, cart }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {products.map((product) => (
                <ProductCard 
                key={product.id} 
                product={product} 
                addToCart={addToCart} 
                removeFromCart={removeFromCart}
                cart={cart}
                />
            ))}
        </div>
    );
};

export default CatalogGrid;