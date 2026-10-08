import { motion } from "framer-motion";

const VARIANTS = {
  up: { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -28 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 28 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -28 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
};

/** Scroll-triggered entrance animation. Wrap any section/element with it. */
export default function Reveal({
  children,
  as = "div",
  direction = "up",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2,
  className = "",
  ...rest
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={VARIANTS[direction] || VARIANTS.up}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Stagger container — wrap a list of Reveal-less children, each a motion item, to cascade in. */
export function RevealGroup({ children, className = "", stagger = 0.08, once = true, amount = 0.2 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ staggerChildren: stagger }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "", direction = "up" }) {
  return (
    <motion.div variants={VARIANTS[direction] || VARIANTS.up} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}
