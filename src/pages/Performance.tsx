import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const Performance = () => (
  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
    <h2 className="text-2xl font-bold">Performance por Diretoria</h2>
  </motion.div>
);

export default Performance;
