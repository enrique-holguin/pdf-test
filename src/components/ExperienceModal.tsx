import React, { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Modal from 'react-modal';
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

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: (data: Experience) => void;
  defaultValues?: Experience;
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px',
    borderRadius: '8px',
    border: 'none'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};


const ExperienceModal: React.FC<Props> = ({ isOpen, onRequestClose, onSave, defaultValues }) => {
  const { register, handleSubmit, control, reset, formState: { errors }, setValue } = useForm<Experience>({
    defaultValues: defaultValues || {
      company: '',
      position: '',
      startDate: new Date(),
      endDate: null,
      isCurrent: false,
      description: '',
    },
  });

  const isCurrent = useWatch({
    control,
    name: 'isCurrent',
  });

  useEffect(() => {
    if (isCurrent) {
      setValue('endDate', null);
    }
  }, [isCurrent, setValue]);

  const onSubmit = (data: Experience) => {
    onSave(data);
    reset();
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Experience Modal">
      <h2>{defaultValues ? 'Editar Experiencia' : 'Añadir Experiencia'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="company" className="block mb-1">Empresa</label>
          <input id="company" {...register("company", { required: "La empresa es requerida" })} className="border p-2 w-full"/>
          <div className="text-red-600 h-4">{errors.company && <span>{errors.company.message}</span>}</div>
        </div>
        <div className="mb-4">
          <label htmlFor="position" className="block mb-1">Cargo</label>
          <input id="position" {...register("position", { required: "El cargo es requerido" })} className="border p-2 w-full"/>
          <div className="text-red-600 h-4">{errors.position && <span>{errors.position.message}</span>}</div>
        </div>
        <div className="mb-4">
          <label htmlFor="startDate" className="block mb-1">Fecha Inicial</label>
          <Controller
            control={control}
            name="startDate"
            rules={{ required: "La fecha inicial es requerida" }}
            render={({ field }) => (
              <DatePicker
                id="startDate"
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                className="border p-2 w-full"
              />
            )}
          />
          <div className="text-red-600 h-4">{errors.startDate && <span>{errors.startDate.message}</span>}</div>
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block mb-1">Fecha Concluyente</label>
          <Controller
            control={control}
            name="endDate"
            rules={{ required: !isCurrent && "La fecha concluyente es requerida" }}
            render={({ field }) => (
              <DatePicker
                id="endDate"
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                className="border p-2 w-full"
                disabled={isCurrent}
              />
            )}
          />
          <div className="text-red-600 h-4">{errors.endDate && <span>{errors.endDate?.message}</span>}</div>
        </div>
        <div className="mb-4">
          <label className="block mb-1">
            <input type="checkbox" {...register("isCurrent")} />
            {' '}Presente
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1">Descripción</label>
          <textarea id="description" {...register("description", { required: "La descripción es requerida" })} className="border p-2 w-full"/>
          <div className="text-red-600 h-4">{errors.description && <span>{errors.description.message}</span>}</div>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4">Guardar</button>
        <button type="button" onClick={onRequestClose} className="bg-red-500 text-white p-2 mt-4 ml-2">Cancelar</button>
      </form>
    </Modal>
  );
};


export default ExperienceModal;
