import { MdFlashOn } from 'react-icons/md';
import { GiCrystalBars } from 'react-icons/gi';
import { TbWorld } from 'react-icons/tb';
import { PiPuzzlePieceFill } from 'react-icons/pi';
import { BsPentagonFill, BsStarFill } from 'react-icons/bs';

// Crea el array de respuestas por defecto para una nueva pregunta de tipo Quiz.
export const createDefaultAnswers = () => [
    { placeholder: "Respuesta 1", text: "", color: "bg-orange-600/80", Icon: MdFlashOn, isOptional: false, isCorrect: true }, 
    { placeholder: "Respuesta 2", text: "", color: "bg-purple-700/80", Icon: GiCrystalBars, isOptional: false, isCorrect: false },
    { placeholder: "Respuesta 3", text: "", color: "bg-amber-500/80", Icon: TbWorld, isOptional: true, isCorrect: false },
    { placeholder: "Respuesta 4", text: "", color: "bg-cyan-700/80", Icon: PiPuzzlePieceFill, isOptional: true, isCorrect: false },
];

// Crea las dos respuestas extra
export const createExtraAnswers = () => [
    { placeholder: "Respuesta 5", text: "", color: "bg-teal-500/80", Icon: BsPentagonFill, isOptional: true, isCorrect: false },
    { placeholder: "Respuesta 6", text: "", color: "bg-pink-500/80", Icon: BsStarFill, isOptional: true, isCorrect: false },
];

// Crea un objeto de pregunta (o diapositiva) nuevo.
export const createNewSlide = (type = 'Quiz') => ({
    id: Date.now(),
    type: type,
    questionText: '',
    answers: type === 'Quiz' ? createDefaultAnswers() : [],
    imagen: null, // Nueva propiedad para la imagen
});