import React, { useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";

const ProductForm = ({ setProducts }) => {
    const fileInputRef = useRef(null)
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: null
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validación básica del formulario
            if (!formData.name || !formData.price || !formData.image) {
                throw new Error("Todos los campos marcados con * son obligatorios");
            }

            // Verificar autenticación
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) throw new Error("Debes iniciar sesión para realizar esta acción");

            // Subir imagen
            const sanitizedName = formData.image.name
                .replace(/\s+/g, "_")
                .replace(/[^a-zA-Z0-9_.-]/g, "");

            const fileName = `products/${Date.now()}_${sanitizedName}`;
            
            const { data: imageData, error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, formData.image, {
                    contentType: formData.image.type,
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;


            // Insertar producto con el path
            const { data: productData, error: insertError } = await supabase
                .from('products')
                .insert([{
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price), // Convertir a número
                    image_url: imageData.path // Guardamos solo el path, no la URL completa
                }])
                .select('*'); // Retorna el registro insertado

            if (insertError) {
                throw insertError
            } else {
                alert('Producto creado');
                setFormData({ name: '', description: '', price: '', image: null });
                setPreview(null);
                
                // Resetear input de archivo
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }

            // Actualizar estado (forma óptima)
            setProducts(prev => [...prev, productData[0]]);

            // Resetear formulario
            setFormData({ name: '', description: '', price: '', image: null });
            setPreview(null);
            alert('Producto creado exitosamente');

        } catch (error) {
            console.error("Error:", error);
            alert(error.message || "Error al crear el producto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Agregar Producto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nombre *"
                    className="w-full p-2 border rounded"
                    required
                />
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descripción"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="Precio *"
                    className="w-full p-2 border rounded"
                    step="0.01"
                    required
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setPreview(URL.createObjectURL(file));
                            setFormData({...formData, image: file});
                        }
                    }}
                    className="w-full p-2 border rounded"
                    accept="image/*"
                    required
                />
                {preview && (
                    <img 
                        src={preview} 
                        alt="Previsualización" 
                        className="w-32 h-32 object-cover rounded mt-2"
                    />
                )}
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar Producto'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;