import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import ExperienceModal from './ExperienceModal';

type Experience = {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string;
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  linkedin: string;
  experience: Experience[];
};

interface Props {
  onSubmit: (data: FormData) => void;
  savedData: FormData;
}

const Form: React.FC<Props> = ({ onSubmit, savedData }) => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: savedData
  });
  const { fields, append, update } = useFieldArray({
    control,
    name: "experience"
  });

  const [unsavedChanges, setUnsavedChanges] = useState<Partial<FormData>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const watchedFields = watch();

  useEffect(() => {
    const changes: Partial<FormData> = {};
    (Object.keys(watchedFields) as (keyof FormData)[]).forEach(field => {
      if (field === 'experience') {
        if (JSON.stringify(watchedFields.experience) !== JSON.stringify(savedData.experience)) {
          changes.experience = watchedFields.experience;
        }
      } else {
        if (watchedFields[field] !== savedData[field]) {
          changes[field] = watchedFields[field];
        }
      }
    });
    setUnsavedChanges(changes);
  }, [watchedFields, savedData]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    setUnsavedChanges({});
  };

  const handleExperienceSave = (data: Experience) => {
    if (editIndex !== null) {
      update(editIndex, data);
    } else {
      append(data);
    }
    setEditIndex(null);
  };

  const handleAddExperience = () => {
    setEditIndex(null);
    setModalOpen(true);
  };

  const handleEditExperience = (index: number) => {
    setEditIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="mb-4 relative">
          <label htmlFor="firstName" className="block mb-1">Nombre</label>
          <input id="firstName" {...register("firstName", { required: "El nombre es requerido" })} className="border p-2 w-full"/>
          {unsavedChanges.firstName && <span className="absolute right-2 top-2 text-yellow-500">!</span>}
          <div className="h-4">
            {unsavedChanges.firstName && <div className="text-yellow-600">Cambios sin guardar</div>}
          </div>
          <div className="text-red-600 h-4">{errors.firstName && <span>{errors.firstName.message}</span>}</div>
        </div>
        <div className="mb-4 relative">
          <label htmlFor="lastName" className="block mb-1">Apellidos</label>
          <input id="lastName" {...register("lastName", { required: "Los apellidos son requeridos" })} className="border p-2 w-full"/>
          {unsavedChanges.lastName && <span className="absolute right-2 top-2 text-yellow-500">!</span>}
          <div className="h-4">
            {unsavedChanges.lastName && <div className="text-yellow-600">Cambios sin guardar</div>}
          </div>
          <div className="text-red-600 h-4">{errors.lastName && <span>{errors.lastName.message}</span>}</div>
        </div>
        <div className="mb-4 relative">
          <label htmlFor="email" className="block mb-1">Email</label>
          <input id="email" {...register("email", { required: "El email es requerido", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "El email no es válido" } })} className="border p-2 w-full"/>
          {unsavedChanges.email && <span className="absolute right-2 top-2 text-yellow-500">!</span>}
          <div className="h-4">
            {unsavedChanges.email && <div className="text-yellow-600">Cambios sin guardar</div>}
          </div>
          <div className="text-red-600 h-4">{errors.email && <span>{errors.email.message}</span>}</div>
        </div>
        <div className="mb-4 relative">
          <label htmlFor="linkedin" className="block mb-1">LinkedIn</label>
          <input id="linkedin" {...register("linkedin", { required: "El perfil de LinkedIn es requerido", pattern: { value: /^https:\/\/www.linkedin.com\/.+$/, message: "El perfil de LinkedIn no es válido" } })} className="border p-2 w-full"/>
          {unsavedChanges.linkedin && <span className="absolute right-2 top-2 text-yellow-500">!</span>}
          <div className="h-4">
            {unsavedChanges.linkedin && <div className="text-yellow-600">Cambios sin guardar</div>}
          </div>
          <div className="text-red-600 h-4">{errors.linkedin && <span>{errors.linkedin.message}</span>}</div>
        </div>
        {/* Experience Section */}
        <div>
          <h3 className="text-lg font-bold mb-2">Experiencia</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4 relative border p-2">
              <div className="flex justify-between">
                <div>
                  <p><strong>Empresa:</strong> {field.company}</p>
                  <p><strong>Cargo:</strong> {field.position}</p>
                  <p><strong>Desde:</strong> {new Date(field.startDate).toLocaleDateString()}</p>
                  <p><strong>Hasta:</strong> {field.isCurrent ? 'Presente' : new Date(field?.endDate ?? Date.now()).toLocaleDateString()}</p>
                </div>
                <button type="button" className="text-blue-500" onClick={() => handleEditExperience(index)}>Editar</button>
              </div>
              <p><strong>Descripción:</strong> {field.description}</p>
              {unsavedChanges.experience && unsavedChanges.experience[index] && <span className="absolute right-2 top-2 text-yellow-500">!</span>}
            </div>
          ))}
          <button type="button" className="bg-blue-500 text-white p-2 mt-4" onClick={handleAddExperience}>Añadir Experiencia</button>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4">Guardar</button>
      </form>

      <ExperienceModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onSave={handleExperienceSave}
        defaultValues={editIndex !== null ? fields[editIndex] : undefined}
      />
    </>
  );
};

export default Form