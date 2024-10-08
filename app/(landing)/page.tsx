'use client';

import { BentoGridContainer } from '@/components/landing/bento/bento-grid-container';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <>
      <section className="mx-10 space-y-6 pb-16 pt-28">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <motion.h1
            className="text-5xl lg:text-6xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.2,
              delay: 0.1,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            Unleash the Power of Efficient Bookmarking
          </motion.h1>

          <motion.h2
            className="mt-3 max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            Organize, manage, and access your favorite links all in one place.
          </motion.h2>
        </div>
      </section>

      <section className="mx-10 space-y-6">
        <motion.div
          className="container flex max-w-[68rem] flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <BentoGridContainer />
        </motion.div>
      </section>
    </>
  );
}
