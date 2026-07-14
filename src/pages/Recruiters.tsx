import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const Recruiters = () => (
  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
    <h2 className="text-2xl font-bold">Recruiters</h2>
  </motion.div>
);

export default Recruiters;
