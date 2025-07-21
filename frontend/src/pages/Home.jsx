import React from 'react';
import { Link } from 'react-router-dom';
import { 
    PencilSquareIcon,
    BookOpenIcon,
    UserGroupIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';

// Datos para las tarjetas, actualizados con la nueva paleta de colores
const features = [
  {
    title: 'Crear Quiz',
    description: 'Diseña tus propios cuestionarios con preguntas personalizadas.',
    icon: PencilSquareIcon,
    link: '/createQuiz',
    iconBgColor: 'bg-blue-100',
    iconTextColor: 'text-blue-600'
  },
  {
    title: 'Mi Biblioteca',
    description: 'Gestiona y organiza todos tus cuestionarios creados.',
    icon: BookOpenIcon,
    link: '/biblioteca',
    iconBgColor: 'bg-sky-100',
    iconTextColor: 'text-sky-600'
  },
  {
    title: 'Unirse a Juego',
    description: 'Ingresa un código y participa en cuestionarios en vivo.',
    icon: UserGroupIcon,
    link: '/join',
    iconBgColor: 'bg-teal-100',
    iconTextColor: 'text-teal-600'
  },
  {
    title: 'Crear Sala',
    description: 'Genera una sala para competir y demostrar tus conocimientos.',
    icon: PlusCircleIcon,
    link: '/room',
    iconBgColor: 'bg-indigo-100',
    iconTextColor: 'text-indigo-600'
  }
];

// Datos para la sección "¿Cómo funciona?"
const steps = [
    {
        number: 1,
        title: 'Crea',
        description: 'Diseña cuestionarios con múltiples preguntas y opciones.',
    },
    {
        number: 2,
        title: 'Comparte',
        description: 'Genera un código único para que otros se unan a la sala.',
    },
    {
        number: 3,
        title: 'Interactúa',
        description: 'Usa los quizzes en vivo para facilitar el aprendizaje en tutorías.',
    }
]

const Home = () => {
  return (
    // Contenedor principal con el nuevo fondo claro y color de texto por defecto
    <div className=" w-full bg-gradient-to-br from-sky-200 via-sky-200 to-sky-100 text-slate-800 font-sans p-4 sm:p-8 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        
        {/* Sección de Bienvenida */}
        <header className="text-center my-12 md:my-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-4">
            ¡Bienvenido a Freehoot!
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600">
            Una herramienta diseñada para las tutorías del equipo de <strong>Tutores Pares de la Universidad del Bío-Bío</strong>.
            Crea, comparte y compite en un entorno interactivo y educativo.
          </p>
        </header>

        {/* Sección de Funcionalidades Principales */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-24">
          {features.map((feature) => (
            <Link to={feature.link} key={feature.title} className="group">
              {/* Tarjeta blanca con sombra y borde sutil */}
              <div className="h-full p-6 bg-white border border-slate-200 shadow-lg rounded-2xl text-center flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className={`mb-4 p-4 rounded-full ${feature.iconBgColor}`}>
                    <feature.icon className={`h-10 w-10 ${feature.iconTextColor}`} aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-500 flex-grow">{feature.description}</p>
              </div>
            </Link>
          ))}
        </main>

        {/* Sección "¿Cómo funciona?" */}
        <section>
          <h2 className="text-center text-4xl font-bold text-slate-900 mb-12">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step) => (
                <div key={step.number} className="p-6 bg-white border border-slate-200 shadow-lg rounded-2xl text-center flex flex-col items-center">
                    {/* Círculo con el color primario de la app */}
                    <div className="h-12 w-12 rounded-full bg-sky-500 text-white flex items-center justify-center text-2xl font-bold mb-4">
                        {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                    <p className="text-slate-500">{step.description}</p>
                </div>
            ))}
          </div>
        </section>

        <footer className="text-center mt-16 md:mt-24 pb-8 text-slate-500">
            <p>© {new Date().getFullYear()} Freehoot. Diseñado para Tutores Pares UBB.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;