'use client';

import FeatureCard from '@/components/landing/feature-card';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <>
      <section className="space-y-6 pt-28 pb-16 mx-10">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <motion.h1
            className="text-5xl lg:text-6xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.2,
              delay: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            Unleash the Power of Efficient Bookmarking
          </motion.h1>

          <motion.h2
            className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 mt-3"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            Organize, manage, and access your favorite links all in one place.
          </motion.h2>
        </div>
      </section>

      <section className="space-y-6 mx-10">
        <div className="container flex max-w-[68rem] flex-col items-center gap-4">
          <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 text-sm sm:mt-20 sm:grid-cols-2 md:gap-y-10 lg:max-w-none lg:grid-cols-3">
            <FeatureCard />
            <FeatureCard />
            <FeatureCard />
            <FeatureCard />
            <FeatureCard />
            <FeatureCard />
          </ul>
        </div>
      </section>
    </>
  );
}
