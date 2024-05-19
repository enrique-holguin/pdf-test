import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience"
  });

  const [unsavedChanges, setUnsavedChanges] = useState<Partial<FormData>>({});

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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
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

      {/* Experience Section */}
      <div className="mb-4">
        <h3 className="text-lg mb-2">Experiencia</h3>
        {fields.map((item, index) => (
          <div key={item.id} className="mb-4 p-4 border rounded-lg relative">
            <button type="button" className="absolute right-2 top-2 text-red-500" onClick={() => remove(index)}>Eliminar</button>
            <div className="mb-4">
              <label htmlFor={`experience.${index}.company`} className="block mb-1">Empresa</label>
              <input id={`experience.${index}.company`} {...register(`experience.${index}.company`, { required: "La empresa es requerida" })} className="border p-2 w-full"/>
              <div className="text-red-600 h-4">{errors.experience?.[index]?.company && <span>{errors.experience[index].company?.message}</span>}</div>
            </div>
            <div className="mb-4">
              <label htmlFor={`experience.${index}.position`} className="block mb-1">Cargo</label>
              <input id={`experience.${index}.position`} {...register(`experience.${index}.position`, { required: "El cargo es requerido" })} className="border p-2 w-full"/>
              <div className="text-red-600 h-4">{errors.experience?.[index]?.position && <span>{errors.experience[index].position?.message}</span>}</div>
            </div>
            <div className="mb-4">
              <label htmlFor={`experience.${index}.startDate`} className="block mb-1">Fecha Inicial</label>
              <Controller
                control={control}
                name={`experience.${index}.startDate`}
                rules={{ required: "La fecha inicial es requerida" }}
                render={({ field }) => (
                  <DatePicker
                    id={`experience.${index}.startDate`}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    className="border p-2 w-full"
                  />
                )}
              />
              <div className="text-red-600 h-4">{errors.experience?.[index]?.startDate && <span>{errors.experience[index].startDate?.message}</span>}</div>
            </div>
            <div className="mb-4">
              <label htmlFor={`experience.${index}.endDate`} className="block mb-1">Fecha Concluyente</label>
              <Controller
                control={control}
                name={`experience.${index}.endDate`}
                rules={{ required: !watchedFields.experience?.[index]?.isCurrent && "La fecha concluyente es requerida" }}
                render={({ field }) => (
                  <DatePicker
                    id={`experience.${index}.endDate`}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    className="border p-2 w-full"
                    disabled={watchedFields.experience?.[index]?.isCurrent}
                  />
                )}
              />
              <div className="text-red-600 h-4">{errors.experience?.[index]?.endDate && <span>{errors.experience[index].endDate?.message}</span>}</div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">
                <input type="checkbox" {...register(`experience.${index}.isCurrent`)} />
                {' '}Presente
              </label>
            </div>
            <div className="mb-4">
              <label htmlFor={`experience.${index}.description`} className="block mb-1">Descripción</label>
              <textarea id={`experience.${index}.description`} {...register(`experience.${index}.description`, { required: "La descripción es requerida" })} className="border p-2 w-full"/>
              <div className="text-red-600 h-4">{errors.experience?.[index]?.description && <span>{errors.experience[index].description?.message}</span>}</div>
            </div>
          </div>
        ))}
        <button type="button" className="bg-green-500 text-white p-2 mt-4" onClick={() => append({ company: '', position: '', startDate: new Date(), endDate: null, isCurrent: false, description: '' })}>Añadir Experiencia</button>
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 mt-4">Guardar</button>
    </form>
  );
}

export default Form