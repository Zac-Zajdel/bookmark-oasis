'use client';

import { Bookmark } from 'lucide-react';

export default function FeatureCard() {
  return (
    <>
      <li className="rounded-2xl border border-gray-200 p-8 relative ">
        <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)]">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.03] stroke-black/5 dark:fill-current dark:stroke-current dark:opacity-[0.04]"
          >
            <defs>
              <pattern
                id="pattern"
                width="72"
                height="56"
                patternUnits="userSpaceOnUse"
                x="50%"
                y="16"
              >
                <path
                  d="M.5 56V.5H72"
                  fill="none"
                ></path>
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              stroke-width="0"
              fill="url(#pattern)"
            ></rect>
            <svg
              x="50%"
              y="16"
              className="overflow-visible"
            >
              <rect
                stroke-width="0"
                width="73"
                height="57"
                x="0"
                y="56"
              ></rect>
              <rect
                stroke-width="0"
                width="73"
                height="57"
                x="-73"
                y="169"
              ></rect>
              <rect
                stroke-width="0"
                width="73"
                height="57"
                x="72"
                y="168"
              ></rect>
            </svg>
          </svg>
        </div>

        <div className="relative z-10">
          <Bookmark className="text-muted-foreground" />
          <h3 className="mt-6 font-semibold tracking-wide leading-6">
            Bookmarks
          </h3>
          <p className="leading-6 text-muted-foreground mt-2">
            Save and organize websites for quick access. Enjoy a streamlined and
            intuitive way to manage your online resources.
          </p>
        </div>
      </li>
    </>
  );
}
