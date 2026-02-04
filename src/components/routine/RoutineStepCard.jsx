import { motion } from 'framer-motion';

export default function RoutineStepCard({ time, title, product, type, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-10 flex flex-col md:flex-row items-center gap-8 mb-6"
        >
            <div className="text-triglow-gold font-serif italic text-2xl w-24">{time}</div>
            <div className="flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 font-medium">{product}</p>
            </div>
            <div className="px-6 py-2 bg-sky-light text-sky-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                {type}
            </div>
        </motion.div>
    );
}