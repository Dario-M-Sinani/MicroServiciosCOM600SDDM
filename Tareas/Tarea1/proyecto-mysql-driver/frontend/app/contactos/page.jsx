'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactosPage() {
  const [contactos, setContactos] = useState([]);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    direccion: '',
    celular: '',
    correo: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchContactos();
  }, []);

  const fetchContactos = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contactos`);
    const data = await res.json();
    setContactos(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/contactos/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/contactos`;
    
    const method = editingId ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      fetchContactos();
      setFormData({
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        direccion: '',
        celular: '',
        correo: ''
      });
      setEditingId(null);
    }
  };

  const handleEdit = (contacto) => {
    setFormData({
      nombres: contacto.nombres,
      apellidos: contacto.apellidos,
      fecha_nacimiento: contacto.fecha_nacimiento?.split('T')[0] || '',
      direccion: contacto.direccion || '',
      celular: contacto.celular || '',
      correo: contacto.correo || ''
    });
    setEditingId(contacto.id);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este contacto?')) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contactos/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchContactos();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Agenda de Contactos</h1>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Editar Contacto' : 'Nuevo Contacto'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Nombres</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Fecha Nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">Celular</label>
            <input
              type="tel"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-1">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingId ? 'Actualizar' : 'Guardar'}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      
      {/* Lista de contactos */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Nombres</th>
              <th className="py-2 px-4 border">Apellidos</th>
              <th className="py-2 px-4 border">Celular</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map((contacto) => (
              <tr key={contacto.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{contacto.nombres}</td>
                <td className="py-2 px-4 border">{contacto.apellidos}</td>
                <td className="py-2 px-4 border">{contacto.celular}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleEdit(contacto)}
                    className="mr-2 text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(contacto.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}