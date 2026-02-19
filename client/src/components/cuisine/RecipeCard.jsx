import { motion } from 'framer-motion';
import { Clock, Flame, Utensils } from 'lucide-react';

export default function RecipeCard({ recipe, onClick }) {
    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="relative h-[400px] w-full rounded-[32px] overflow-hidden cursor-pointer group shadow-2xl shadow-black/50"
        >
            {/* Background Image */}
            <img
                src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2680&auto=format&fit=crop"}
                alt={recipe.titre}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

            {/* Content Layer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">

                {/* Type Badge */}
                <span className="self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                    {recipe.type || 'Déjeuner'}
                </span>

                <h3 className="text-3xl font-bold text-white leading-tight">
                    {recipe.titre}
                </h3>

                {/* Macros Row */}
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-white/80">
                        <Clock size={16} className="text-blue-400" />
                        <span className="text-sm font-medium">{recipe.dureeMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/80">
                        <Flame size={16} className="text-orange-400" />
                        <span className="text-sm font-medium">{recipe.calories} kcal</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/80">
                        <Utensils size={16} className="text-emerald-400" />
                        <span className="text-sm font-medium">{recipe.proteines}g Prot</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
