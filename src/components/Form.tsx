import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  linkedin: string;
};

interface Props {
  onSubmit: (data: FormData) => void;
  savedData: FormData;
}

const Form: React.FC<Props> = ({ onSubmit, savedData }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: savedData
  });
  const [unsavedChanges, setUnsavedChanges] = useState<Partial<FormData>>({});

  const watchedFields = watch();

  useEffect(() => {
    const changes: Partial<FormData> = {};
    (Object.keys(watchedFields) as (keyof FormData)[]).forEach(field => {
      if (watchedFields[field] !== savedData[field]) {
        changes[field] = watchedFields[field];
      }
    });
    setUnsavedChanges(changes);
  }, [watchedFields, savedData]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    setUnsavedChanges({});
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="mb-4 relative">
        <label htmlFor="firstName" className="block mb-1">Nombre</label>
        <input id="firstName" {...register("firstName", { required: "El nombre es requerido" })} className="border p-2 w-full"/>
        {unsavedChanges.firstName && <span className="absolute right-2 top-2 text-yellow-500">!</span>}
        <div className="text-red-600 h-4">{errors.firstName && <span>{errors.firstName.message}</span>}</div>
      </div>
      <div className="mb-4 relative">
        <label htmlFor="lastName" className="block mb-1">Apellidos</label>
        <input id="lastName" {...register("lastName", { required: "Los apellidos son requeridos" })} className="border p-2 w-full"/>
        {unsavedChanges.lastName && <span className="absolute right-2 top-2 text-yellow-500">!</span>}
        <div className="text-red-600 h-4">{errors.lastName && <span>{errors.lastName.message}</span>}</div>
      </div>
      <div className="mb-4 relative">
        <label htmlFor="email" className="block mb-1">Email</label>
        <input id="email" type="email" {...register("email", { required: "El email es requerido", pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } })} className="border p-2 w-full"/>
        {unsavedChanges.email && <span className="absolute right-2 top-2 text-yellow-500">!</span>}
        <div className="text-red-600 h-4">{errors.email && <span>{errors.email.message}</span>}</div>
      </div>
      <div className="mb-4 relative">
        <label htmlFor="linkedin" className="block mb-1">LinkedIn</label>
        <input id="linkedin" {...register("linkedin", { required: "El URL de LinkedIn es requerido", pattern: { value: /https:\/\/(www\.)?linkedin\.com\/.*$/, message: "URL de LinkedIn inválido" } })} className="border p-2 w-full"/>
        {unsavedChanges.linkedin && <span className="absolute right-2 top-2 text-yellow-500">!</span>}
        <div className="text-red-600 h-4">{errors.linkedin && <span>{errors.linkedin.message}</span>}</div>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 mt-4">Guardar</button>
    </form>
  );
}

export default Form