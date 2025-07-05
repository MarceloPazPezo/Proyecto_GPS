import { useNavigate } from 'react-router-dom';
import { login } from '@services/auth.service.js';   // Asegúrate de que esta ruta sea correcta
import useLogin from '@hooks/auth/useLogin.jsx';     // Asegúrate de que esta ruta sea correcta
import fondoSVG from '../assets/fondo_azul.svg'; 

const Login = () => {
    const navigate = useNavigate();
    const {
        errorEmail,
        errorPassword,
        errorData,
        handleInputChange
    } = useLogin();

    const loginSubmit = async (data) => {
        try {
            const response = await login(data);
            if (response.status === 'Success') {
                navigate('/home');
            } else if (response.status === 'Client error') {
                errorData(response.details);
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        loginSubmit(data);
    };

    const fields = [
        {
            label: "Correo electrónico",
            name: "email",
            placeholder: "ejemplo@gmail.cl",
            type: "email",
            required: true,
            minLength: 15,
            maxLength: 30,
            errorMessageData: errorEmail,
            onChange: (e) => handleInputChange('email', e.target.value),
        },
        {
            label: "Contraseña",
            name: "password",
            placeholder: "**********",
            type: "password",
            required: true,
            minLength: 8,
            maxLength: 26,
            pattern: /^[a-zA-Z0-9]+$/,
            errorMessageData: errorPassword,
            onChange: (e) => handleInputChange('password', e.target.value)
        },
    ];

    return (
        <main 
            className="flex items-center justify-center min-h-screen w-full p-4 font-sans"
            style={{
                backgroundImage: `url(${fondoSVG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="w-full max-w-md">
                
                {/* aqui ta la cosa pa moodificar que tanto de glass el white/(numerito)  */}
                <form 
                    onSubmit={handleSubmit} 
                    className="bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl p-8 sm:p-10 rounded-2xl mb-6"
                >
                    <h1 className="text-3xl font-bold text-white mb-8 text-center">
                        Bienvenido
                    </h1>
                    
                    <div className="w-full space-y-5">
                        {fields.map((field) => (
                            <div key={field.name}>
                                <label 
                                    htmlFor={field.name} 
                                    className="block text-sm font-semibold text-slate-200 mb-2"
                                >
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    id={field.name}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    minLength={field.minLength}
                                    maxLength={field.maxLength}
                                    pattern={field.pattern?.source}
                                    onChange={field.onChange}
                                    className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                                />
                                <p className="text-sky-300 text-xs font-semibold mt-1 h-5">
                                    {field.errorMessageData}
                                </p>
                            </div>
                        ))}
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                    >
                        Iniciar Sesión
                    </button>
                    
                </form>
                

                <a 
                    href="/join" 
                    className="block w-full text-center p-3 rounded-lg border-2 border-white/40 text-white font-semibold transition-colors duration-200 hover:bg-white/10"
                >
                    Unirse a una actividad
                </a>
            </div>
        </main>
    );
};

export default Login;