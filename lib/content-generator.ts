import { slugify } from './slugify'

export interface Topic {
  key: string
  label: string
  prompt: (companyName: string) => string
  title: (companyName: string) => string
  excerpt: (companyName: string) => string
  body: (companyName: string) => string
  tags: string[]
}

export const TOPICS: readonly Topic[] = [
  {
    key: 'product-update',
    label: 'Product',
    prompt: (c) => `Write this month's product update for the ${c} blog: cover the top shipped features, the small fixes customers actually noticed, and one forward-looking note on what's coming next, in a tone that reads as candid rather than promotional.`,
    title: (c) => `What's New at ${c}: This Month's Product Update`,
    excerpt: (c) => `A roundup of the features and improvements ${c} shipped this month.`,
    body: (c) => `This month the team at ${c} shipped a batch of improvements aimed squarely at the requests we hear most from customers. None of these are flashy on their own, but together they add up to a noticeably faster, calmer product.

## A faster path to first value

The headline change is a rebuilt onboarding flow. New accounts now reach their first meaningful result in under five minutes, down from nearly twenty. We did this by cutting the setup wizard from seven steps to three and moving every optional decision behind a "customize later" link instead of forcing it up front.

We also pre-fill sensible defaults based on the account's stated use case, so most teams can accept the defaults and start working immediately rather than configuring a blank slate. Early data from the last two weeks shows activation within the first session is up sharply, and support tickets tagged "confused during setup" have all but disappeared.

The old wizard asked for a company size, an industry, three integration preferences, and a naming convention before it would let anyone touch the product. Most of that turned out to be guessable from context or safely deferrable, so we deferred it. The three questions that remain are the ones that actually change what a new account sees on day one.

## Papercuts, closed

Big launches get the headlines, but most of what makes a product feel solid is a long list of small fixes. This cycle we closed out over forty of them: clearer error messages that tell you what to do next instead of just what went wrong, a dashboard that no longer flickers on load, and a round of accessibility fixes across forms and modals so keyboard and screen-reader navigation works the way it should.

We also fixed a subtle timezone bug that was misdating a small number of scheduled exports — if you noticed exports landing on the wrong day last month, that's resolved now, and no data was lost in the process.

None of these fixes came from a single loud bug report. Most surfaced from a weekly review of support tickets tagged "papercut," a label the support team started using specifically so this kind of feedback wouldn't get lost between "broken" and "feature request." That process is now permanent, and it's the main input into every maintenance-focused release ${c} ships.

## Performance under the hood

Alongside the visible changes, this release also included a round of database index tuning on the three tables that account for the bulk of read traffic. Query plans that used to fall back to a sequential scan under certain filter combinations now hit an index reliably, which shows up as a steadier response time on the search and reporting views in particular — the two screens most likely to be open all day.

We're mentioning this one specifically because it's the kind of change that never shows up in a changelog people read, but it's exactly the kind of unglamorous work that keeps ${c} feeling fast a year from now instead of just on launch day.

## What's next

Looking ahead, the next release focuses on bulk actions: multi-select across tables, batch edits, and an undo window generous enough that "oops" isn't a support ticket. We're also rebuilding the mobile web experience from the ground up, since usage from phones and tablets has more than doubled this year.

Beyond that, we're scoping a permissions overhaul that moves from an all-or-nothing admin flag to role-based access with per-workspace scoping — the single most requested item from teams above fifty seats, and one we're deliberately taking slowly to avoid the kind of migration pain a rushed permissions model tends to create later.

As always, thank you for the feedback that shapes this roadmap. Keep it coming, and expect another update from ${c} next month.`,
    tags: ['Product', 'Updates'],
  },
  {
    key: 'customer-story',
    label: 'Customer Story',
    prompt: (c) => `Write a customer case study for the ${c} blog about a team that adopted ${c} to solve a specific operational bottleneck. Include a direct quote from the customer, a concrete before/after metric, and avoid making it read like a testimonial ad.`,
    title: (c) => `How One Team Cut Onboarding Time in Half with ${c}`,
    excerpt: (c) => `A look at how a fast-growing customer team put ${c} to work.`,
    body: (c) => `When a mid-size operations team adopted ${c}, their biggest pain point wasn't the work itself — it was the time it took to bring new hires up to speed on how that work actually got done. Institutional knowledge lived in a mix of shared docs, old Slack threads, and whoever happened to remember the right answer.

## The problem with tribal knowledge

"Every new hire cost us two weeks of someone else's time," their operations lead told us. "Not because the job was hard, but because nothing was written down in a place people would actually find it." That's a familiar story, and it's exactly the gap ${c} is built to close: a single place where process, context, and history live together instead of scattered across five tools.

The team had tried to fix this before, more than once. A wiki got started with good intentions and was abandoned within a quarter because nobody wanted to be the one updating it. A shared spreadsheet of "who to ask about what" worked until two of the four people on it left the company. The pattern each time was the same: documentation that lived apart from the work itself decayed the moment the work changed, and the work always changes.

## What changed after adopting ${c}

Within the first month, structured workflows and searchable knowledge inside ${c} cut their onboarding checklist from three weeks to ten days. New hires could search for "how do we handle a refund request" and get the actual current process, not a six-month-old doc someone forgot to update, because the workflow itself is the source of truth.

The team also started using ${c}'s built-in checklists to turn tribal knowledge into repeatable steps as they discovered gaps — any time someone asked a question that wasn't already documented, the answer became part of the workflow for the next person.

What made this stick, where the wiki hadn't, is that updating the process and doing the process are the same action inside ${c}. There's no separate step where someone has to remember to go write down what changed — the workflow itself is what changed, and the next person to run it sees the update automatically.

## Rolling it out beyond the first team

Once the operations team had ten days down from three weeks, word spread internally, and two more teams asked to onboard the same way within the quarter. The rollout wasn't a company-wide mandate — it was individual team leads seeing a concrete number and asking for it themselves, which the operations lead credits as the reason adoption stuck instead of fading after the initial push.

By the second quarter, five teams were running some version of the same pattern: capture the process as a living workflow the first time someone has to explain it out loud, rather than after the fact as a documentation project nobody has time for.

## The result

"The thing that surprised us most was how little training the tool itself required," their team lead said. "It just fit how we already worked, so the learning curve was really about the job, not the software." Three months in, time-to-productivity for new hires is down 52%, and the team has stopped treating onboarding as a special project that needs a dedicated owner.

Stories like this are why we build ${c} the way we do — tools should disappear into the work, not add another thing to learn on top of it.`,
    tags: ['Customers', 'Case Study'],
  },
  {
    key: 'engineering-deep-dive',
    label: 'Engineering',
    prompt: (c) => `Write an engineering deep-dive for the ${c} blog about a specific reliability or scaling change shipped recently. Explain the problem, the tradeoffs considered, and what load testing or incident data justified the approach — written for an audience of engineers, not executives.`,
    title: (c) => `Under the Hood: How ${c} Handles Data at Scale`,
    excerpt: (c) => `An engineering look at the systems powering ${c} behind the scenes.`,
    body: (c) => `Scaling a system reliably is rarely about one big rewrite — it's usually a long series of unglamorous, well-tested changes. That's been true for ${c} too, and this post walks through the most recent round of it.

## Moving off the request path

Over the last quarter, the engineering team at ${c} moved several hot paths from synchronous processing to a queue-backed model. Previously, a handful of expensive operations — re-indexing search, recalculating aggregates, fanning out notifications — ran inline on the request that triggered them, which meant a slow downstream dependency could stall a request that otherwise had nothing to do with it.

Now those operations enqueue a job and return immediately. Workers pick jobs up from the queue, process them independently, and retry with backoff on transient failures. The result is a meaningfully lower p95 latency on the affected endpoints, and — just as important — a system where a slow job no longer creates a slow page load for an unrelated user.

We deliberately kept the queue consumer count low to start — four workers per region rather than the twelve the theoretical throughput math suggested — because under-provisioning a new system is a slow, observable, correctable problem, while over-provisioning it hides bugs in the retry logic behind spare capacity that won't always be there.

## Load testing against real shapes of traffic

We paired every change with load testing against production-shaped traffic rather than synthetic uniform load, since our real traffic is bursty: quiet for stretches, then a spike when a large customer runs a bulk operation. Regressions under bursty load are expensive to unwind after the fact, so we'd rather catch them in a staging environment built to reproduce that shape.

That testing surfaced one real issue before it shipped: a queue consumer that scaled linearly with job size instead of staying constant, which would have caused backlogs during exactly the bulk operations it needed to handle. Catching it here cost us a day; catching it in production would have cost a lot more than that.

We also ran a chaos test where we killed a worker mid-job at random intervals for six hours straight. Two jobs came back processed twice before we caught it — both were operations we'd assumed were naturally idempotent and weren't quite. Both are fixed now, and "assumed idempotent" is no longer an acceptable justification in a job handler's code review.

## Observability that matches the new shape

A queue-backed system trades one kind of visibility for another: you lose the simple "the request either succeeded or it didn't," and you gain a fleet of workers whose state lives outside any single request. We built three new dashboards to compensate — queue depth over time, per-job-type latency percentiles, and a dead-letter view that pages someone the moment a job fails its final retry instead of quietly disappearing into a log line.

That last one matters most. The previous synchronous version failed loudly by definition — a stuck operation was a stuck request, and someone noticed within minutes. A queued job that silently drops on its last retry can fail quietly for days if nothing is watching for it, so we treated that dashboard as a launch blocker, not a nice-to-have.

## What this means for reliability

None of this is visible to customers day-to-day, which is the point. The result is a system at ${c} that stays fast as usage grows, without asking anyone to think about queue depth or worker counts. We'll keep writing about changes like this as we make them — not because they're exciting, but because we think showing the work is the most honest way to talk about reliability.`,
    tags: ['Engineering', 'Deep Dive'],
  },
  {
    key: 'industry-trends',
    label: 'Industry',
    prompt: (c) => `Write an industry-perspective post for the ${c} blog on a broader shift happening in the market ${c} operates in, and stake out a specific, defensible opinion on where ${c} is positioned relative to that shift — not a neutral trend roundup.`,
    title: (c) => `Where the Industry Is Headed, and Where ${c} Fits In`,
    excerpt: (c) => `${c}'s take on where the broader industry is moving next.`,
    body: (c) => `It's a good moment to zoom out. Across the industry, teams are consolidating tools rather than adding new point solutions, and the reasons behind that shift say a lot about where things are headed next.

## The cost of tool sprawl finally caught up

For years, the default response to a new need was to buy a new tool. That worked fine when headcount and budgets were growing to match, but it left a lot of teams maintaining a patchwork of a dozen apps that each did one thing, none of which talked to each other cleanly. The integration tax — the hours spent moving data between systems by hand, or building brittle scripts to do it — quietly became one of the largest hidden costs in a lot of operations budgets.

At ${c}, we see the current wave of consolidation as validation of a bet we made early: that depth in one workflow beats breadth across many. A tool that does one job extremely well, and integrates cleanly into the systems a team already trusts, tends to outlast a tool that tries to do everything passably.

The tell-tale sign of sprawl isn't the tool count on its own — some teams genuinely need a dozen specialized systems. It's the presence of a role, official or not, whose real job is reconciling the same piece of information across three different places by hand every week. When that role exists, consolidation usually pays for itself within a quarter.

## What "integrates cleanly" actually means

The teams doing this well share one trait — they pick tools that fit into their existing systems rather than demanding a rebuild around the new tool. That means real APIs, not just CSV exports; webhooks instead of polling; and a data model that maps onto how the rest of the business already thinks about the work, instead of forcing a new vocabulary onto every team that touches it.

It also means the tool has to be honest about what it's not. We'd rather be excellent at the workflow we own and connect well to the billing system, the CRM, and the support desk a customer already runs, than try to badly replicate all three ourselves.

## The failure mode nobody talks about

There's a quieter risk on the other side of consolidation: picking one tool to do everything and discovering, eighteen months in, that it does the core workflow well and everything adjacent to it poorly, with no easy way out because every process now assumes the all-in-one system's quirks. We've watched teams migrate off exactly this kind of platform, and it's a harder project than the original sprawl ever was.

The lesson we take from watching that happen elsewhere: a tool earns the right to be "the one system" for a workflow by being excellent at that workflow specifically, not by having a checkbox for every adjacent feature a sales deck might ask about.

## Where we're placing our bets

That's the standard we hold ${c} to as we plan the next set of integrations, and it's the lens we use to evaluate every feature request that comes in asking us to become something broader than we are. The roadmap ahead leans further into that position rather than away from it.`,
    tags: ['Industry', 'Perspective'],
  },
  {
    key: 'tips-and-tricks',
    label: 'Tips',
    prompt: (c) => `Write a power-user tips post for the ${c} blog listing lesser-known features that experienced users rely on daily, each with a concrete example of the time it saves — skip anything covered in the basic onboarding flow.`,
    title: (c) => `Seven ${c} Features Power Users Rely On`,
    excerpt: (c) => `Lesser-known ${c} features that save experienced users real time.`,
    body: (c) => `New users of ${c} usually learn the basics fast — but a few features tend to stay hidden until someone points them out. Here are the seven that longtime users tell us they'd miss the most.

## 1. Keyboard shortcuts

Most core actions in ${c} have a shortcut, and learning even five of them noticeably speeds up daily use. Press "?" anywhere in the app to see the full list for the screen you're on — it's context-aware, so it only shows shortcuts that actually apply to what you're looking at.

## 2. Saved views

Rather than rebuilding the same filter every day, ${c} lets you pin it once and return to it with a click. Saved views can be shared with a team too, so "this week's overdue items" becomes a link you send instead of a filter everyone rebuilds separately.

## 3. Bulk edit via multi-select

Hold shift and click to select a range, or cmd/ctrl-click for individual items, then apply a change to all of them at once. This is the single biggest time-saver we hear about from teams managing more than a few hundred records, and it's easy to miss because there's no button telling you it exists.

## 4. Command palette

Cmd+K (or Ctrl+K on Windows) opens a searchable command palette that can jump to any record, run any action, or navigate to any settings page without touching the mouse. Power users report this cuts navigation time roughly in half once it becomes muscle memory.

## 5. Templates for repeatable work

If you find yourself creating the same kind of record over and over with small variations, turn the first one into a template. Templates pre-fill every field that doesn't change and leave the rest blank, so repeatable work stops requiring you to remember what to fill in each time.

## 6. Custom fields scoped to a view, not the whole workspace

A field that only matters to one team doesn't have to clutter every other team's screen. Scoping a custom field to a specific saved view keeps it visible exactly where it's relevant, which is also why teams that adopt this early tend to end up with far fewer abandoned or half-used fields a year later.

## 7. The audit trail as a debugging tool, not just a compliance box

Every record in ${c} keeps a full history of who changed what and when, and power users treat it as a first resort when something looks wrong rather than a last resort for compliance requests. "Who touched this last" is usually a faster path to the answer than re-checking your own work first.

Small habits like these compound. Start with one, and ${c} starts to feel a lot faster within a week.`,
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

  return {
    title,
    slug: `${slugify(title)}-${input.taskId.slice(0, 8)}`,
    excerpt: topic.excerpt(input.companyName),
    contentMd: topic.body(input.companyName).trim(),
    tags: topic.tags,
    thumbnailUrl: `https://picsum.photos/seed/${input.taskId}/800/450`,
  }
}
