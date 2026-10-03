import { defineCollection } from "astro:content"
import { file } from "astro/loaders"
import { z } from "astro/zod"

const projects = defineCollection({
  // projects.json is an ordered array without ids; the index is the id and the display order.
  loader: file("src/data/projects.json", {
    parser: (text) =>
      JSON.parse(text).map((project: object, index: number) => ({
        id: String(index),
        ...project,
      })),
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      year: z.string(),
      description: z.string(),
      fullDescription: z.string(),
      skill: z.string(),
      image: image(),
    }),
})

export const collections = { projects }
