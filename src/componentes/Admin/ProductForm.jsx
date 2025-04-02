import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { FiXCircle, FiCheckCircle } from 'react-icons/fi';

const ProductForm = ({productToEdit, setProducts, onCancelEdit }) => {
    const fileInputRef = useRef(null)
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: null
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                description: productToEdit.description,
                price: productToEdit.price.toString(),
                image: null
            });

            // Mostrar preview de imagen existente
            if (productToEdit.image_url) {
                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(productToEdit.image_url);
                setPreview(publicUrl);
            }
        } else {
            setFormData({ name: '', description: '', price: '', image: null });
            setPreview(null);
        }
    }, [productToEdit]);

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                description: productToEdit.description,
                price: productToEdit.price.toString(),
                image: null // Mantenemos null para no sobreescribir la imagen
            });
            
            // Obtener URL pública de la imagen existente
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(productToEdit.image_url);
                
            setPreview(publicUrl);
        } else {
            setFormData({ name: '', description: '', price: '', image: null });
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [productToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            if (productToEdit) {
                // Lógica de actualización
                let updateData = {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price)
                };
    
                // Manejar nueva imagen solo si se seleccionó una
                if (formData.image) {
                    const sanitizedName = formData.image.name
                        .replace(/\s+/g, "_")
                        .replace(/[^a-zA-Z0-9_.-]/g, "");
    
                    const fileName = `products/${Date.now()}_${sanitizedName}`;
    
                    const { data: imageData, error: uploadError } = await supabase.storage
                        .from('product-images')
                        .upload(fileName, formData.image);
    
                    if (uploadError) throw uploadError;
                    
                    updateData.image_url = imageData.path;
                }
    
                const { data, error } = await supabase
                    .from('products')
                    .update(updateData)
                    .eq('id', productToEdit.id)
                    .select('*');
    
                if (error) throw error;
    
                // Actualizar estado local
                setProducts(prev => prev.map(p => 
                    p.id === productToEdit.id ? data[0] : p
                ));
                
                // Resetear solo los campos editables y mantener preview
                setFormData(prev => ({
                    ...prev,
                    name: data[0].name,
                    description: data[0].description,
                    price: data[0].price.toString(),
                    image: null
                }));
                
                // Limpiar input de archivo
                if (fileInputRef.current) fileInputRef.current.value = '';
                setPreview(null);
                alert('Producto actualizado correctamente');
            } else {
                // Lógica para nuevo producto
                if (!formData.name || !formData.price || !formData.image) {
                    throw new Error("Todos los campos marcados con * son obligatorios");
                }
    
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Debes iniciar sesión para realizar esta acción");
    
                // Subir imagen
                const sanitizedName = formData.image.name
                    .replace(/\s+/g, "_")
                    .replace(/[^a-zA-Z0-9_.-]/g, "");
    
                const fileName = `products/${Date.now()}_${sanitizedName}`;
    
                const { data: imageData, error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, formData.image);
    
                if (uploadError) throw uploadError;
    
                // Insertar nuevo producto
                const { data: insertedData, error: insertError } = await supabase
                    .from('products')
                    .insert([{
                        name: formData.name,
                        description: formData.description,
                        price: parseFloat(formData.price),
                        image_url: imageData.path
                    }])
                    .select('*');
                
                if (insertError) throw insertError;
                
                // Actualizar estado y resetear formulario
                setProducts(prev => [...prev, insertedData[0]]);
    
                if (insertError) throw insertError;
    
                // Reset completo
                setFormData({ name: '', description: '', price: '', image: null });
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                alert('Producto creado exitosamente');
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message || "Error al procesar el producto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            {productToEdit && (
                <button
                    onClick={onCancelEdit}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                >
                    <FiXCircle size={24} />
                </button>
            )}

            <h2 className="text-2xl font-semibold mb-4">
                {productToEdit ? 'Editar Producto' : 'Agregar Producto'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nombre"
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
                    required={!productToEdit} // Solo requerido cuando no está editando
                />
                {preview && (
                    <img 
                        src={preview} 
                        alt="Previsualización" 
                        className="w-32 h-32 object-cover rounded mt-2"
                    />
                )}
                <div className="flex gap-4">
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2 justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        'Guardando...'
                    ) : (
                        <>
                            <FiCheckCircle size={18} />
                            {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
                        </>
                    )}
                </button>
                    {productToEdit && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex items-center gap-2"
                        >
                            <FiXCircle size={18} />
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProductForm;