import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { fieldIcons } from '@helpers/fieldIcons';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Form = ({ title, fields, buttonText, onSubmit, footerContent, backgroundColor, autoComplete, size = 'max-w-2xl' }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const onFormSubmit = (data) => {
        onSubmit(data);
    };

    return (
        // --- CAMBIOS PRINCIPALES AQUÍ ---
        // 1. Se usa `w-full` para que ocupe el 100% del ancho en móviles.
        // 2. La prop `size` (`max-w-2xl` por defecto) limita el ancho en pantallas grandes.
        // 3. `mx-auto` centra el formulario en el medio de la pantalla.
        // 4. Se ajustó el padding para ser más amigable en móviles (p-6).
        <form
            className={`bg-blue backdrop-blur-lg border border-[#2C3E50]/20 shadow-xl p-6 sm:p-8 md:p-10 rounded-2xl w-full ${size} mx-auto`}
            style={{ backgroundColor: backgroundColor }}
            onSubmit={handleSubmit(onFormSubmit)}
            autoComplete={autoComplete === undefined ? "on" : autoComplete}
        >
            {title && (
                // --- CAMBIO DE TAMAÑO DE TEXTO RESPONSIVO ---
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-8 text-center">{title}</h1>
            )}

            {fields.map((field, index) => (
                <div className="w-full mb-4" key={index}>
                    {field.label && <label className="block text-sm font-semibold text-[#2C3E50] mb-2" htmlFor={field.name}>{field.label}</label>}
                    
                    {field.fieldType === 'input' && (
                        <div className="relative flex items-center">
                          {fieldIcons[field.name] && (
                            <span className="absolute left-3 text-[#2C3E50] opacity-70 pointer-events-none">
                              {fieldIcons[field.name]({ size: 22 })}
                            </span>
                          )}
                          <input
                            className={`w-full p-3 ${fieldIcons[field.name] ? 'pl-11' : ''} ${field.type === 'password' ? 'pr-11' : ''} bg-white border border-[#2C3E50]/20 rounded-lg text-[#2C3E50] placeholder-[#2C3E50]/60 focus:outline-none focus:ring-2 focus:ring-[#4EB9FA]/40 transition`}
                            {...register(field.name, {
                              required: field.required ? 'Este campo es obligatorio' : false,
                              minLength: field.minLength ? { value: field.minLength, message: `Debe tener al menos ${field.minLength} caracteres` } : false,
                              maxLength: field.maxLength ? { value: field.maxLength, message: `Debe tener máximo ${field.maxLength} caracteres` } : false,
                              pattern: field.pattern ? { value: field.pattern, message: field.patternMessage || 'Formato no válido' } : false,
                              validate: field.validate || {},
                            })}
                            name={field.name}
                            placeholder={field.placeholder}
                            type={field.type === 'password' && field.name === 'password' ? (showPassword ? 'text' : 'password') :
                              field.type === 'password' && field.name === 'newPassword' ? (showNewPassword ? 'text' : 'password') :
                              field.type}
                            defaultValue={field.defaultValue || ''}
                            disabled={field.disabled}
                            onChange={field.onChange}
                            autoComplete={field.autoComplete || "off"}
                          />
                          {field.type === 'password' && (
                            <button 
                                type="button" 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C3E50] opacity-70" 
                                onClick={field.name === 'password' ? togglePasswordVisibility : toggleNewPasswordVisibility} 
                                tabIndex={0} 
                                aria-label="Mostrar/ocultar contraseña"
                            >
                                { (field.name === 'password' && showPassword) || (field.name === 'newPassword' && showNewPassword) 
                                    ? <MdVisibility size={22} /> 
                                    : <MdVisibilityOff size={22} />
                                }
                            </button>
                          )}
                        </div>
                    )}

                    {field.fieldType === 'textarea' && (
                        <textarea
                            className="w-full p-3 bg-white border border-[#2C3E50]/20 rounded-lg text-[#2C3E50] placeholder-[#2C3E50]/60 focus:outline-none focus:ring-2 focus:ring-[#4EB9FA]/40 transition"
                            {...register(field.name, {
                                required: field.required ? 'Este campo es obligatorio' : false,
                                minLength: field.minLength ? { value: field.minLength, message: `Debe tener al menos ${field.minLength} caracteres` } : false,
                                maxLength: field.maxLength ? { value: field.maxLength, message: `Debe tener máximo ${field.maxLength} caracteres` } : false,
                                pattern: field.pattern ? { value: field.pattern, message: field.patternMessage || 'Formato no válido' } : false,
                                validate: field.validate || {},
                            })}
                            name={field.name}
                            placeholder={field.placeholder}
                            defaultValue={field.defaultValue || ''}
                            disabled={field.disabled}
                            onChange={field.onChange}
                            rows="4" // Añadido para un tamaño por defecto razonable
                        />
                    )}

                    {field.fieldType === 'select' && (
                        <select 
                            className="w-full p-3 bg-white border border-[#2C3E50]/20 rounded-lg text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#4EB9FA]/40 transition appearance-none"
                            {...register(field.name, {
                                required: field.required ? 'Este campo es obligatorio' : false,
                                validate: field.validate || {},
                            })}
                            name={field.name}
                            defaultValue={field.defaultValue || ''}
                            disabled={field.disabled}
                            onChange={field.onChange}
                        >
                            <option value="">Seleccionar opción</option>
                            {field.options && field.options.map((option, optIndex) => (
                                <option className="text-black bg-white" key={optIndex} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* --- MENSAJE DE ERROR MEJORADO --- */}
                    <div className={`error-message text-red-600 font-semibold mt-1 min-h-[1.25em] text-sm`}> 
                        {errors[field.name]?.message || field.errorMessageData || ''}
                    </div>
                </div>
            ))}

            {buttonText && (
                <button 
                    className="w-full bg-[#2C3E50]/10 border border-[#2C3E50]/20 text-[#2C3E50] font-bold py-3 rounded-lg mt-4 transition-all duration-300 ease-in-out hover:bg-[#2C3E50]/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#4EB9FA]/50" 
                    type="submit"
                >
                    {buttonText}
                </button>
            )}

            {footerContent && <div className='text-center text-sm text-[#2C3E50]/80 font-medium mt-4 h-5'>{footerContent}</div>}
        </form>
    );
};

export default Form;