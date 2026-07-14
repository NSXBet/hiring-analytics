import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const Overview = () => (
  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
    <h2 className="text-2xl font-bold">Overview</h2>
    <p className="text-muted-foreground mt-2">Visão geral das vagas.</p>
  </motion.div>
);

export default Overview;
