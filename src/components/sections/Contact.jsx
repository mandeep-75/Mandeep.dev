import { motion } from 'framer-motion';
import SideColumn from '../ui/SideColumn';
import Tilt from '../three/Tilt';
import Word3D from '../ui/Word3D';
import {
  DURATION,
  EASE_OUT,
  WORD_PERSPECTIVE,
  eyebrowFlatVariants,
  eyebrowVariants,
  useReducedMotion,
} from '../../lib/motion';

const EMAIL = 'mandeep.dev1309@gmail.com';

export default function Contact() {
    const reducedMotion = useReducedMotion();

    return (
        /* Final block of the zigzag: after the last right-hand project card,
           Contact returns to the left track and the model shows through the
           band between them one last time.

           No form — the card carries the contact info: the email address,
           straight to mail. `id="contact"` stays: the hero's
           "Start a Project" button and the `?contact=true` deep link both
           scroll to it. */
        <section id="contact" className="py-32">
            <SideColumn side="left">
                <motion.div
                    variants={reducedMotion ? eyebrowFlatVariants : eyebrowVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-6 flex items-center gap-3"
                >
                    <div className="w-12 h-[2px] bg-gradient-to-r from-[#ffd166] to-transparent" />
                    <span className="font-mono text-sm uppercase tracking-wider text-[#ffd166]">
                        Get in Touch
                    </span>
                </motion.div>

                <h2 className="mb-6 text-4xl font-bold text-[#fdf1e8] md:text-5xl">
                    <Word3D as="span" text="Let's" style={WORD_PERSPECTIVE} className="text-[#fdf1e8]" />{" "}
                    <Word3D
                        as="span"
                        text="Connect"
                        style={WORD_PERSPECTIVE}
                        className="gradient-text"
                        delay={0.12}
                        depth={260}
                    />
                </h2>

                <motion.p
                    className="mb-8 max-w-xl text-lg text-[#f3d9cf]"
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: DURATION.reveal, ease: EASE_OUT, delay: 0.15 }}
                >
                    Have a project in mind? Drop me an email or send a message —
                    whichever is quicker for you.
                </motion.p>

                {/* The contact card. Translucent rather than a light surface so
                    the fire backdrop glows through it, but dark enough
                    (rgba(0,0,0,0.3) over blood red) that the cream type on top
                    clears 8:1. */}
                <Tilt
                    className="relative rounded-3xl"
                    max={3.5}
                    perspective={1400}
                    lift={22}
                    glare
                >
                    <motion.div
                        className="rounded-3xl border border-[rgba(253,241,232,0.18)] bg-[rgba(0,0,0,0.3)] p-8"
                        initial={{ opacity: 0, y: reducedMotion ? 0 : 26 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: DURATION.reveal, ease: EASE_OUT, delay: 0.25 }}
                    >
                        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-[#ffd166]">
                            Email
                        </p>
                        <a
                            href={`mailto:${EMAIL}`}
                            className="block break-all text-lg font-medium text-[#fdf1e8] underline-offset-4 transition-colors hover:text-[#ffd166] hover:underline md:text-xl"
                        >
                            {EMAIL}
                        </a>
                    </motion.div>
                </Tilt>
            </SideColumn>
        </section>
    );
}
