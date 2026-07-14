import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const Details = () => (
  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
    <h2 className="text-2xl font-bold">Details</h2>
  </motion.div>
);

export default Details;
