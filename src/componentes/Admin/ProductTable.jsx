import { supabase } from "../../lib/supabaseClient";

const ProductTable = ({ products, setProducts }) => {
    const handleDelete = async (id) => {
        const {error} = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (!error) {
            setProducts(products.filter(product => product.id !== id))
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Lista de Productos</h2>
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-2">Nombre</th>
                        <th className="text-left p-2">Precio</th>
                        <th className="text-left p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="border-b">
                            <td className="p-2">{product.name}</td>
                            <td className="p-2">${product.price}</td>
                            <td className="p-2">
                                <button className="text-blue-500 hover:text-blue-700 mr-2">
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;