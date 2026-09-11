import { slugify } from './slugify'

export interface Topic {
  key: string
  label: string
  title: (companyName: string) => string
  excerpt: (companyName: string) => string
  paragraphs: (companyName: string) => string[]
  tags: string[]
}

export const TOPICS: readonly Topic[] = [
  {
    key: 'product-update',
    label: 'Product',
    title: (c) => `What's New at ${c}: This Month's Product Update`,
    excerpt: (c) => `A roundup of the features and improvements ${c} shipped this month.`,
    paragraphs: (c) => [
      `This month the team at ${c} shipped a batch of improvements aimed squarely at the requests we hear most from customers.`,
      `The headline change is a faster onboarding flow: new accounts now reach their first meaningful result in under five minutes, down from nearly twenty.`,
      `We also closed out a long list of smaller papercuts — clearer error messages, a snappier dashboard, and a handful of accessibility fixes across the app.`,
      `As always, thank you for the feedback that shapes this roadmap. Keep it coming, and expect another update from ${c} next month.`,
    ],
    tags: ['Product', 'Updates'],
  },
  {
    key: 'customer-story',
    label: 'Customer Story',
    title: (c) => `How One Team Cut Onboarding Time in Half with ${c}`,
    excerpt: (c) => `A look at how a fast-growing customer team put ${c} to work.`,
    paragraphs: (c) => [
      `When a mid-size operations team adopted ${c}, their biggest pain point was the time it took to bring new hires up to speed.`,
      `Within the first month, structured workflows and searchable knowledge inside ${c} cut their onboarding checklist from three weeks to ten days.`,
      `"The thing that surprised us most was how little training the tool itself required," their team lead told us. "It just fit how we already worked."`,
      `Stories like this are why we build ${c} the way we do — tools should disappear into the work, not add another thing to learn.`,
    ],
    tags: ['Customers', 'Case Study'],
  },
  {
    key: 'engineering-deep-dive',
    label: 'Engineering',
    title: (c) => `Under the Hood: How ${c} Handles Data at Scale`,
    excerpt: (c) => `An engineering look at the systems powering ${c} behind the scenes.`,
    paragraphs: (c) => [
      `Scaling a system reliably is rarely about one big rewrite — it's usually a long series of unglamorous, well-tested changes, and that's been true for ${c} too.`,
      `Over the last quarter, the engineering team at ${c} moved several hot paths from synchronous processing to a queue-backed model, cutting p95 latency significantly.`,
      `We paired every change with load testing against production-shaped traffic, since regressions here are expensive to unwind after the fact.`,
      `The result is a system at ${c} that stays fast as usage grows, without asking customers to think about any of it.`,
    ],
    tags: ['Engineering', 'Deep Dive'],
  },
  {
    key: 'industry-trends',
    label: 'Industry',
    title: (c) => `Where the Industry Is Headed, and Where ${c} Fits In`,
    excerpt: (c) => `${c}'s take on where the broader industry is moving next.`,
    paragraphs: (c) => [
      `It's a good moment to zoom out. Across the industry, teams are consolidating tools rather than adding new point solutions.`,
      `At ${c}, we see this as validation of a bet we made early: that depth in one workflow beats breadth across many.`,
      `The teams doing this well share one trait — they pick tools that integrate cleanly with what they already have, rather than demanding a rebuild.`,
      `That's the standard we hold ${c} to as we plan the next set of integrations.`,
    ],
    tags: ['Industry', 'Perspective'],
  },
  {
    key: 'tips-and-tricks',
    label: 'Tips',
    title: (c) => `Five ${c} Features Power Users Rely On`,
    excerpt: (c) => `Lesser-known ${c} features that save experienced users real time.`,
    paragraphs: (c) => [
      `New users of ${c} usually learn the basics fast — but a few features tend to stay hidden until someone points them out.`,
      `Keyboard shortcuts are the first: most core actions in ${c} have a shortcut, and learning even five of them noticeably speeds up daily use.`,
      `Saved views come next. Rather than rebuilding the same filter every day, ${c} lets you pin it once and return to it with a click.`,
      `Small habits like these compound. Start with one, and ${c} starts to feel a lot faster within a week.`,
    ],
    tags: ['Tips', 'Productivity'],
  },
] as const

export interface GenerateBlogPostInput {
  topicKey: string
  taskId: string
  companyName: string
}

export interface GeneratedBlogPost {
  title: string
  slug: string
  excerpt: string
  contentMd: string
  tags: string[]
  thumbnailUrl: string
}

export function generateBlogPost(input: GenerateBlogPostInput): GeneratedBlogPost {
  const topic = TOPICS.find((t) => t.key === input.topicKey)
  if (!topic) {
    throw new Error(`Unknown topic key: ${input.topicKey}`)
  }

  const title = topic.title(input.companyName)
  const paragraphs = topic.paragraphs(input.companyName)

  return {
    title,
    slug: `${slugify(title)}-${input.taskId.slice(0, 8)}`,
    excerpt: topic.excerpt(input.companyName),
    contentMd: paragraphs.map((p) => p.trim()).join('\n\n'),
    tags: topic.tags,
    thumbnailUrl: `https://picsum.photos/seed/${input.taskId}/800/450`,
  }
}
