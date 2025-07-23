// app/admin/components/actividadForm.tsx
"use client";

import { useState } from "react";
import { ActividadAdminService } from '../services/actividad.service'

const ActividadForm = () => {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    nivelMin: 0,
    exp: 0,
    tipo: "virtual",
    evento: null as string | null,
  });

  const actividadService = new ActividadAdminService();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "nivelMin" || name === "exp" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formToSubmit = form.tipo === "fisica" ? { ...form, evento: null } : form;
      await actividadService.createActividad(formToSubmit);
      alert("Actividad creada con éxito");
      setForm({ title: "", desc: "", nivelMin: 0, exp: 0, tipo: "virtual", evento: null });
    } catch (error) {
      alert("Error al crear actividad");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-2xl font-semibold">Crear Actividad</h3>
      <div>
        <label className="block mb-2">Título:</label>
        <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-2">Descripción:</label>
        <textarea name="desc" value={form.desc} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-2">Nivel Mínimo:</label>
        <input name="nivelMin" type="number" value={form.nivelMin} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-2">Experiencia:</label>
        <input name="exp" type="number" value={form.exp} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-2">Tipo:</label>
        <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="virtual">Virtual</option>
          <option value="fisica">Física</option>
        </select>
      </div>
      {form.tipo === "virtual" && (
        <div>
          <label className="block mb-2">Evento:</label>
          <input name="evento" value={form.evento || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
      )}
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600">Crear</button>
    </form>
  );
};

export default ActividadForm;
