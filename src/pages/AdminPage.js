import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import ProductForm from '../componentes/Admin/ProductForm'
import ProductTable from '../componentes/Admin/ProductTable'

const AdminPage = () => {
    const [editingProduct, setEditingProduct] = useState(null);
    const [products, setProducts] = useState([])
    const [session, setSession] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) navigate('/login')
            setSession(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (!session) navigate('/login')
        })

        return () => subscription?.unsubscribe()
    }, [navigate])

    useEffect(() => {
        try {

            if (session) {
                const fetchProducts = async () => {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')

                    if (!error) setProducts(data)
                }
                fetchProducts()
            }
        } catch (error) {
            alert("error al obtener los productos: ", error)
        }
    }, [session])

    const handleEdit = (product) => {
        setEditingProduct(product);
        // Aquí puedes abrir un modal/formulario de edición
    };

    if (!session) return <div>Cargando...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
                <button
                    onClick={() => supabase.auth.signOut()}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Cerrar Sesión
                </button>
            </div>
            <ProductForm 
                setProducts={setProducts} 
                productToEdit={editingProduct}
                onCancelEdit={() => setEditingProduct(null)}
            />
            <ProductTable 
                products={products} 
                setProducts={setProducts} 
                onEdit={handleEdit}
                />
        </div>
    )
}

export default AdminPage