/* ────────────────────────────────────────────────────────────────── */
/*  src/lib/content/blog.ts                                            */
/*  Source of truth for every guide. Same shape the page expects.     */
/* ────────────────────────────────────────────────────────────────── */

export interface PostSection {
  /** Optional heading. If omitted, paragraph renders inline. */
  h?: string;
  /** Paragraph text. */
  p: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  /** ISO date string (YYYY-MM-DD). Used for sorting, <time>, schema. */
  date: string;
  /** Estimated reading time in minutes. */
  readMins: number;
  /** Ordered body sections. Each renders as <section><h2><p>. */
  body: PostSection[];
}

/* ══════════════════════════════════════════════════════════════════ */
/*  Posts                                                             */
/* ══════════════════════════════════════════════════════════════════ */

export const POSTS: Post[] = [
  /* ────────────────────────────────────────────────────────────── */
  /*  1. Emergency fund — the deep guide                            */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'how-much-emergency-fund-india',
    title: 'How much emergency fund do you actually need in India?',
    description:
      'Most advice says 3–6 months. The real number depends on your income stability, dependents, and the fixed costs you cannot cut.',
    date: '2026-01-22',
    readMins: 8,
    body: [
      {
        p: 'The "3 to 6 months" number you see everywhere is a starting point, not an answer. It was designed for salaried employees in stable industries with a single income stream and no dependents. If any of those things is not true for you, the correct number is different — sometimes dramatically.',
      },
      {
        h: 'Start with essential expenses, not total expenses',
        p: 'Your emergency fund covers the bills that keep arriving even when income stops. Rent, EMIs, utilities, groceries, insurance premiums, school fees, and medicines. It does not cover dining out, weekend trips, or new gadgets — you would cut those in week one of a job loss. Calculate your essential monthly expenses honestly. Most people find it is 50–70% of their total spending.',
      },
      {
        h: 'Multiply by the right number of months',
        p: 'The multiplier depends entirely on how long it would realistically take you to replace your income. A software engineer in Bengaluru with a strong network might find a new role in six weeks. A small business owner whose income depends on a single large client might need nine months to rebuild. A dual-income household has a built-in cushion because one salary keeps flowing.',
      },
      {
        h: 'Adjust for the things that break the formula',
        p: 'Single earner supporting parents and children: add 3 months. Variable or commission-based income: add 3 months. Chronic medical condition in the family: add 2 months. A working spouse in a stable job: subtract 2 months. A large loan EMI that eats more than 30% of take-home: add 2 months, because missing even one payment has outsized consequences.',
      },
      {
        h: 'Where to keep the money',
        p: 'Split it across two places. The first month of expenses lives in a plain savings account linked to your primary bank — instant access matters more than yield. The remaining 2–11 months live in a sweep-in fixed deposit or a liquid mutual fund. Sweep-in FDs give you near-instant access with 6–7% returns. Liquid funds give similar returns with T+1 redemption. Never put your emergency fund in equity, ELSS, or anything with a lock-in. The whole point is that it is available when the market is down 30% and you just lost your job.',
      },
      {
        h: 'The order of operations',
        p: 'If you have credit card debt above 30% interest, you face a genuine tension. Paying off the card gives a guaranteed 30%+ return. Building an emergency fund gives peace of mind. The right answer for most people: build one month of expenses in cash first (this is your minimum viable buffer), then aggressively pay down the high-interest debt, then resume building the full fund. One month in cash prevents the situation where a small emergency forces you back onto the credit card.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  2. Savings rate — the one number that matters                 */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'savings-rate-the-one-number',
    title: 'Savings rate: the one number that decides when you can stop working',
    description:
      'Not net worth, not income, not returns. The percentage of income you keep is the single biggest lever on financial independence.',
    date: '2026-01-19',
    readMins: 7,
    body: [
      {
        p: 'Two people earn the same ₹20 lakh a year. One saves 10%, the other saves 40%. After 20 years, assuming the same 10% return, the second person has roughly seven times the first person\'s wealth. Same income, same years, same markets. The only difference is the savings rate.',
      },
      {
        h: 'Why it beats everything else',
        p: 'Investment returns are outside your control. Market timing is a fantasy. Income growth is partly luck. But your savings rate is a decision you make every month. It is the only lever that compounds without needing cooperation from anyone.',
      },
      {
        h: 'How to calculate it honestly',
        p: 'Savings rate = (take-home income − total expenses) ÷ take-home income × 100. Use take-home, not gross — using gross overstates your rate by the tax and PF you never actually received. Include EPF and NPS contributions on the income side, because they are your money being saved. Include EMIs on the expense side, because they are real cash out.',
      },
      {
        h: 'The benchmarks that matter',
        p: 'Below 10%: you are essentially working to survive. Between 10% and 20%: normal, but retirement is far away. Between 20% and 30%: strong, you will retire comfortably on schedule. Between 30% and 50%: aggressive, you will likely retire early if you keep it up. Above 50%: financial independence becomes a question of when, not if.',
      },
      {
        h: 'Where to find the extra 10%',
        p: 'Do not start with the small things. Start with the big three: housing, transport, and food. Someone paying ₹45,000 rent could move 20 minutes further out and save ₹12,000 a month — that is a 15% savings-rate jump in one decision. A paid-off car saves ₹8,000 a month in EMI. Cooking at home five days a week saves ₹6,000–10,000 a month in a metro. These three moves alone can take you from 10% to 30%.',
      },
      {
        h: 'Raise it with every raise',
        p: 'The trick that works: every time your income increases, put at least half the raise into savings before you see it. A ₹10,000 monthly raise becomes ₹5,000 more savings and ₹5,000 more lifestyle. You do not feel the missing half because you never had it. Do this for ten years and your savings rate can double without a single cut to your existing lifestyle.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  3. Debt avalanche vs snowball                                 */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'debt-avalanche-vs-snowball-india',
    title: 'Debt avalanche vs snowball: which payoff method actually works?',
    description:
      'The avalanche saves more money on paper. The snowball keeps more people from quitting. Here is how to pick the right one for you.',
    date: '2026-01-16',
    readMins: 6,
    body: [
      {
        p: 'You have three loans: a credit card at 42%, a personal loan at 14%, and a car loan at 9%. You have ₹25,000 extra each month to throw at debt. Which do you pay first? The answer is not as obvious as the math suggests.',
      },
      {
        h: 'The avalanche method',
        p: 'Avalanche means pay minimums on everything, then throw every spare rupee at the highest-interest debt first. Once that is gone, roll the payment into the next highest. It is mathematically optimal — you pay the least possible total interest. On a typical ₹8 lakh debt portfolio, avalanche saves ₹40,000–80,000 compared to snowball.',
      },
      {
        h: 'The snowball method',
        p: 'Snowball means pay minimums on everything, then throw every spare rupee at the smallest balance first, regardless of interest rate. You clear small debts quickly. Each cleared debt gives you a psychological win, which research suggests is the single biggest predictor of whether someone actually finishes the plan.',
      },
      {
        h: 'The uncomfortable truth about behaviour',
        p: 'A 2016 study by Harvard Business Review found that people who used snowball were significantly more likely to actually eliminate their debt, even though avalanche is mathematically better. The reason: motivation is a finite resource. If the first debt takes 18 months to clear, most people quit at month 8. If the first debt takes 3 months, you keep going.',
      },
      {
        h: 'The hybrid that works for most Indians',
        p: 'If you have a credit card outstanding above 30% interest, attack that first — regardless of balance. Nothing else comes close to a guaranteed 42% return. After credit cards, switch to snowball for the remaining loans. You get the mathematical benefit of killing the worst debt and the psychological benefit of quick wins afterward.',
      },
      {
        h: 'The prepayment question on home loans',
        p: 'Home loans at 8–9% sit in a strange zone. Prepaying gives a guaranteed 8.5% return, tax-free. The same money in an index fund could give 10–12% but with volatility and taxes. The decision depends on how much you value certainty. For most people, prepaying the home loan past the first 5 years is a poor use of money because most of the interest is already paid. Prepay early or do not prepay at all.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  4. SIP vs lump sum                                            */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'sip-vs-lump-sum-when-to-use',
    title: 'SIP vs lump sum: when each one is actually better',
    description:
      'SIP smooths out entry price. Lump sum maximises time in the market. Here is when each method wins in Indian conditions.',
    date: '2026-01-13',
    readMins: 6,
    body: [
      {
        p: 'Every mutual fund advertisement pushes SIP. But SIP is not always better. In a market that trends up more often than it trends down, a lump sum invested today usually beats money invested in installments over the next twelve months. The catch is that "usually" is doing a lot of work.',
      },
      {
        h: 'What SIP actually does',
        p: 'SIP buys you units every month at whatever price the market offers. When prices fall, you get more units. When prices rise, you get fewer. Over time, your average cost per unit ends up between the highest and lowest prices you encountered. This is a mechanical benefit, not a market-beating strategy.',
      },
      {
        h: 'When SIP wins',
        p: 'SIP is the better choice when your income arrives monthly and you cannot deploy a large amount at once. It is also better when valuations are stretched — in late 2021, someone with ₹12 lakh invested as a lump sum watched it fall to ₹9 lakh within six months, while a SIP investor kept buying into the fall and recovered faster. Finally, SIP wins on behaviour: it removes the decision of "should I invest today" which is what kills most investing plans.',
      },
      {
        h: 'When lump sum wins',
        p: 'Lump sum wins when the money is genuinely available and the market is not in a historically expensive zone. If you received a bonus, sold a property, or inherited money, deploying it immediately puts the full amount to work for the full duration. Historical Nifty data shows that lump sum beats a 12-month SIP roughly 65–70% of the time.',
      },
      {
        h: 'The practical hybrid',
        p: 'If you have a large lump sum and are nervous about entry price, split it into 3–6 monthly installments (an STP — systematic transfer plan). You get most of the time-in-market benefit while smoothing entry. Anything longer than 12 months is just procrastination dressed up as strategy.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  5. Index vs active funds                                      */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'index-funds-vs-active-funds-india',
    title: 'Index funds vs active funds: what the last 10 years actually show',
    description:
      'Indian active funds have beaten their benchmarks more often than US active funds. But the story changes when you look at what you actually keep.',
    date: '2026-01-10',
    readMins: 7,
    body: [
      {
        p: 'The US has settled this debate: over 90% of active large-cap funds fail to beat the S&P 500 over 15 years. India is more interesting. Roughly 50% of active large-cap funds and 60% of mid-cap funds have beaten their benchmarks over the last decade. So why do so many advisors still push index funds?',
      },
      {
        h: 'The survivorship problem',
        p: 'Those statistics exclude funds that were closed or merged. They also ignore that the outperformance number in any given year is dominated by a small handful of star managers who may not manage your money next year. When you pick an active fund, you are betting not just that active management works, but that this specific manager will continue to be one of the winners. The base rate for that bet is not favourable.',
      },
      {
        h: 'The expense ratio difference',
        p: 'A Nifty 50 index fund charges 0.1–0.2% annually. An active large-cap fund charges 1.5–2%. On a ₹50 lakh portfolio, that is ₹7–10 lakh of fees over 20 years, compounded. The active fund has to outperform by that much just to break even with the index. Most do not, because the expense ratio drag is a certainty while the outperformance is a probability.',
      },
      {
        h: 'Where active funds still make sense',
        p: 'Small-cap and mid-cap segments are less efficient. Fewer analysts cover them, so a good fund manager can genuinely find mispriced stocks. If you are going to use active funds, this is where the odds are best. Debt funds are also better actively managed because credit selection matters more than in equity. But for large-cap exposure, the case for active management is weak.',
      },
      {
        h: 'The pragmatic portfolio',
        p: 'A simple, defensible structure: 60% of equity in index funds (Nifty 50 + Nifty Next 50), 30% in 2–3 active mid/small-cap funds with a 10-year track record, 10% in an international index fund for geographic diversification. This gives you the low-cost base of indexing with exposure to segments where active management has a real chance of adding value.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  6. Section 80C — where to actually put money                  */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'section-80c-where-to-invest',
    title: 'Section 80C: where to actually put your ₹1.5 lakh this year',
    description:
      'PPF, ELSS, EPF, life insurance, principal on a home loan, NSC, and five-year FDs. Here is how to rank them by usefulness.',
    date: '2026-01-08',
    readMins: 7,
    body: [
      {
        p: 'Section 80C lets you deduct up to ₹1.5 lakh from taxable income. What it does not tell you is that some of the options are terrible. Buying an endowment insurance policy to save tax, for example, has cost Indian savers more money than any other financial product in the last thirty years.',
      },
      {
        h: 'The mandatory ones first',
        p: 'Your EPF contribution is already counted. If you are a salaried employee contributing 12% of basic, you have probably used ₹80,000–1,10,000 of the limit before you make a single decision. The employer contribution does not count against your 80C limit, but yours does. Check your payslip to see how much room is left.',
      },
      {
        h: 'The best use of the remaining space',
        p: 'If you have equity exposure as a goal, ELSS (tax-saving mutual funds) is the best option. Three-year lock-in, equity returns, and the lowest effective cost. If you prefer guaranteed returns and do not need the money for 15 years, PPF is excellent — tax-free interest at 7.1% is genuinely competitive with taxed FD returns at 7.5%.',
      },
      {
        h: 'The ones to avoid',
        p: 'Endowment life insurance policies combine terrible insurance with terrible investment returns. A typical policy returns 4–5% over 20 years while charging you 3× what term insurance costs for 10× the cover. Do not buy them for tax. Buy term insurance for protection (₹15,000 a year for ₹1 crore cover) and invest the difference in ELSS or PPF.',
      },
      {
        h: 'The underrated option: home loan principal',
        p: 'The principal repayment portion of your home loan EMI counts toward 80C. The interest portion has its own deduction under Section 24(b) for up to ₹2 lakh. So a home loan can absorb your entire 80C limit without you making any separate investment. Check your lender\'s annual statement to see the principal/interest split.',
      },
      {
        h: 'The new tax regime changes everything',
        p: 'Under the new regime, you do not get 80C at all. The tax rates are lower, so the total tax can be lower than the old regime even without deductions. Run both calculations on your actual income before assuming 80C helps you. For many earners below ₹15 lakh, the new regime now wins outright.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  7. NPS explained                                              */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'nps-explained-should-you-invest',
    title: 'NPS explained: the extra ₹50,000 deduction most people ignore',
    description:
      'The National Pension System gives you an additional deduction under 80CCD(1B) and low-cost equity exposure. Here is the honest case for and against.',
    date: '2026-01-05',
    readMins: 7,
    body: [
      {
        p: 'The National Pension System is the only retirement product in India that gives you a tax deduction above the 80C ceiling. That alone makes it worth understanding. But NPS also has a lock-in that most people underestimate and an annuity requirement at maturity that eats into returns.',
      },
      {
        h: 'The extra deduction',
        p: 'Section 80CCD(1B) allows an additional ₹50,000 deduction beyond the ₹1.5 lakh under 80C. On a 30% marginal tax rate, that is ₹15,000 saved per year. If your employer also contributes under 80CCD(2), that is a further deduction — up to 14% of basic salary under the new regime. For high earners, this is a significant number.',
      },
      {
        h: 'The structure',
        p: 'NPS has two tiers. Tier 1 is the retirement account with the tax benefits and the lock-in. Tier 2 is a voluntary savings account with no tax benefit and no lock-in — essentially a low-cost mutual fund. Almost everyone should ignore Tier 2; there are better options. Tier 1 is where the tax benefit lives.',
      },
      {
        h: 'Asset allocation choice',
        p: 'Within Tier 1, you choose between Active and Auto choice. Active lets you pick your equity allocation (up to 75% under 50 years old). Auto automatically reduces equity as you age, from 50% at 35 down to 10% at 55. For most people, Auto with the aggressive lifecycle is a reasonable default.',
      },
      {
        h: 'The two problems with NPS',
        p: 'First, at age 60, you must use at least 40% of the corpus to buy an annuity. Annuity rates in India hover around 5–6% — you can do better with a simple debt fund. Second, the lock-in is real. You cannot touch the money before 60 except in specific circumstances. If you will need flexibility before then, NPS is the wrong vehicle.',
      },
      {
        h: 'The verdict',
        p: 'If you are in the 30% tax bracket and already maxing out 80C, NPS is a reasonable ₹50,000 parking spot. The extra deduction is worth more than the annuity drag at maturity. If you are below the 20% bracket, the deduction is small enough that the lock-in and annuity requirement are not worth it. Use PPF or ELSS instead.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  8. Term insurance — how much cover                            */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'how-much-term-insurance-cover-india',
    title: 'How much term insurance cover do you actually need?',
    description:
      'The 10× income rule is a starting point that fails most families. Here is a proper way to size the number.',
    date: '2026-01-02',
    readMins: 6,
    body: [
      {
        p: 'The most commonly quoted rule is "10× your annual income." For a ₹15 lakh earner, that means ₹1.5 crore cover. But if that earner is 35 with two children, a home loan, and dependent parents, the right number is probably ₹3 crore or more. The rule of thumb underprotects exactly the people who need cover most.',
      },
      {
        h: 'The proper calculation',
        p: 'Cover = (annual income × years until retirement) + outstanding loans + future goals (children\'s education, marriage) − existing liquid assets. For a 35-year-old earning ₹15 lakh with 25 years to retirement, a ₹50 lakh home loan, and ₹50 lakh earmarked for children: ₹3.75 crore + ₹50 lakh + ₹50 lakh − ₹30 lakh existing savings = about ₹4.4 crore. Round to ₹5 crore if you want margin.',
      },
      {
        h: 'Why 10× fails',
        p: 'The 10× rule assumes your family can earn a return that replaces your income forever. At 8% post-tax, ₹1.5 crore generates ₹12 lakh a year — enough to replace ₹15 lakh income only if you are willing to slowly erode principal. At current inflation, that erosion is fast. Insurance is not a lottery ticket; it is income replacement, and it needs to replace income for decades.',
      },
      {
        h: 'What does not count as cover',
        p: 'Do not count your employer\'s group life insurance. It typically ends the moment you leave the job. Do not count ULIPs or endowment policies — they usually provide minimal life cover relative to what you are paying. Do not count your EPF balance as life insurance. The only thing that counts is a proper term plan in your own name.',
      },
      {
        h: 'Buying it correctly',
        p: 'Buy online to avoid agent commission. Choose the longest tenure available — you want cover until retirement. Add a critical illness rider only if the premium is reasonable (usually 10–15% of base premium). Avoid return-of-premium riders; they roughly double the premium and give you back money that would have grown more in an index fund. Pay annually, not monthly, because monthly premiums carry a loading.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  9. Health insurance                                            */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'health-insurance-employer-vs-personal',
    title: 'Why your employer health insurance is not enough',
    description:
      'Group cover is convenient and cheap. It also disappears the day you resign, retire, or get laid off — usually when you need it most.',
    date: '2025-12-28',
    readMins: 6,
    body: [
      {
        p: 'Roughly 60% of insured Indians rely entirely on employer-provided health insurance. This is a mistake with consequences that only show up in the worst moments: a layoff, a resignation, or a retirement coincides with the time you most need cover and find yourself without it.',
      },
      {
        h: 'The three problems with group cover',
        p: 'First, it ends with the job. Second, the sum insured is usually ₹3–5 lakh, which does not survive a single cardiac event or cancer treatment in a metro hospital. Third, when you switch jobs, the new employer starts you fresh — pre-existing conditions may have developed in the meantime.',
      },
      {
        h: 'The right structure',
        p: 'Keep the employer cover, but also buy a personal policy with at least ₹10 lakh sum insured. A personal policy is portable, accumulates no-claim bonus over the years, and survives any job change. At age 30, a ₹10 lakh personal policy costs ₹8,000–12,000 a year. At age 40, it costs ₹18,000–25,000. At age 50, ₹40,000+. The premium nearly doubles every decade, which is why you buy early even if it feels unnecessary.',
      },
      {
        h: 'What to look for in a personal policy',
        p: 'A hospital network that includes the good hospitals in your city. A room-rent cap of at least 2% of sum insured (or no cap at all). A waiting period of 2–3 years for pre-existing conditions, not 4–5. A no-claim bonus that increases your sum insured every year. Cashless claim settlement at the top hospitals in your pin code.',
      },
      {
        h: 'The family floater vs individual question',
        p: 'Family floaters cover the whole family under one sum insured — cheaper, but a single large claim can exhaust the entire pool for everyone. Individual policies cost 30–50% more but protect each person separately. For families with young children and healthy adults, a floater is usually fine. Once parents cross 60 or anyone develops a chronic condition, switch to individual policies for that person.',
      },
      {
        h: 'Super top-up is the smart shortcut',
        p: 'A super top-up policy pays claims above a threshold (say ₹5 lakh), effectively extending your base cover to ₹15–25 lakh at a fraction of the cost. If you have a base policy with ₹5 lakh cover, adding a ₹15 lakh super top-up costs ₹5,000–8,000 a year. This is the highest-value health insurance structure for most families.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  10. Home loan prepayment                                      */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'should-you-prepay-home-loan',
    title: 'Should you prepay your home loan? It depends on the year',
    description:
      'Prepaying a 20-year loan in year 3 saves a fortune. Prepaying it in year 15 barely moves the needle. Here is how to think about it.',
    date: '2025-12-24',
    readMins: 6,
    body: [
      {
        p: 'Home loan prepayment is one of the most emotionally charged decisions in personal finance. The math is not complicated, but the timing changes everything. A ₹10 lakh prepayment in year 3 of a 20-year loan saves ₹28 lakh in interest. The same ₹10 lakh in year 15 saves ₹2 lakh. Same money, same loan, different decade.',
      },
      {
        h: 'How EMI interest actually works',
        p: 'In the early years of a loan, most of your EMI goes to interest and very little to principal. In year 1 of a ₹50 lakh, 8.5%, 20-year loan, roughly 82% of your EMI is interest. By year 10, that drops to 55%. By year 18, it is 15%. Prepaying reduces the principal, which reduces all future interest — so the earlier you do it, the more future interest you eliminate.',
      },
      {
        h: 'The tax angle',
        p: 'Under the old tax regime, you can deduct up to ₹2 lakh of home loan interest under Section 24(b). If you are in the 30% bracket, that is a ₹60,000 annual benefit — which lowers the effective interest rate on your loan to about 6% after tax. At an effective 6%, prepaying versus investing in an index fund is not obvious. The arbitrage is small.',
      },
      {
        h: 'The right rule of thumb',
        p: 'Prepay if the loan is in the first 5 years. The interest saved is enormous and the tax benefit only partially offsets it. After year 10, consider carefully: your effective rate is lower, the interest remaining is small, and money in an index fund has a real chance of beating 6% post-tax. After year 15, do not prepay unless you have spare cash with no better use.',
      },
      {
        h: 'The psychological factor',
        p: 'Many people prepay not because the math says so but because the idea of a large debt stresses them. This is legitimate. A person who sleeps better with a smaller loan will make better financial decisions overall. If prepayment gives you peace of mind, do it and stop second-guessing the last few percentage points. Financial planning is not a spreadsheet exercise; behaviour matters more than optimisation.',
      },
      {
        h: 'How to prepay correctly',
        p: 'Always specify "reduce tenure" not "reduce EMI" when you prepay. Reducing tenure maximises interest savings. Reducing EMI gives immediate cash flow relief but leaves you paying interest for the full original term. Also, check for prepayment penalties — floating-rate home loans have no prepayment penalty in India, but some fixed-rate loans do.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  11. Credit score                                              */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'how-credit-score-works-india',
    title: 'How credit score works in India (and how to fix a bad one)',
    description:
      'CIBIL, Experian, Equifax, CRIF. Five factors, one number, and why paying your card in full is not the same as paying on time.',
    date: '2025-12-20',
    readMins: 7,
    body: [
      {
        p: 'Your credit score is a three-digit number between 300 and 900 that every lender in India checks before approving a loan, a credit card, or even a rental application. Above 750 opens doors. Below 650 closes them. And most people have no idea how the number is calculated.',
      },
      {
        h: 'The four bureaus',
        p: 'India has four credit bureaus: CIBIL, Experian, Equifax, and CRIF Highmark. Lenders report your behaviour to all four, but the score can differ slightly between them because they weight factors differently. CIBIL is the most widely used. You are entitled to one free full report from each bureau every year — get all four before applying for any major loan.',
      },
      {
        h: 'The five factors',
        p: 'Payment history is 35% of your score. Credit utilisation is 30%. Length of credit history is 15%. Credit mix (secured vs unsecured, cards vs loans) is 10%. New credit enquiries are 10%. Notice that two factors alone decide 65% of your score — get those right and the rest takes care of itself.',
      },
      {
        h: 'The utilisation trap',
        p: 'Credit utilisation is your card outstanding divided by your total card limit. If you have ₹2 lakh total limit and spend ₹1.2 lakh, your utilisation is 60% — bad for your score even if you pay in full every month. The fix is counterintuitive: get more cards or request a limit increase. With a ₹5 lakh total limit, that same ₹1.2 lakh spend drops utilisation to 24%, which is healthy. Never use more than 30% of your limit across all cards combined.',
      },
      {
        h: 'Paying in full vs paying on time',
        p: 'Paying on time means paying at least the minimum due. Paying in full means clearing the statement balance. Both keep your payment history clean, but only paying in full keeps your utilisation low. Also, when you pay matters — payment after the due date is reported as late even if it is before the next statement date.',
      },
      {
        h: 'Fixing a bad score',
        p: 'Get your report. Dispute any errors (this is more common than people think). Pay down card balances to below 30% utilisation. Do not close old cards — length of history matters. Do not apply for multiple new cards in a short window. Set auto-pay for at least the minimum on every card. Most scores improve visibly within 6 months of consistent behaviour.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  12. Budgeting                                                 */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'budgeting-methods-that-work-india',
    title: 'Three budgeting methods that actually work (and one that does not)',
    description:
      '50/30/20, zero-based, and pay-yourself-first. Here is the version that works for Indian salaries, irregular income, and joint families.',
    date: '2025-12-16',
    readMins: 6,
    body: [
      {
        p: 'Almost everyone who tries to budget fails within three months. Not because budgeting is hard, but because they tried a method designed for someone else. A freelancer cannot use a fixed-percentage method. A joint family cannot use a zero-based budget without coordinating four people. The right method depends on how your income and expenses actually work.',
      },
      {
        h: '50/30/20 — the starter',
        p: 'Needs 50%, wants 30%, savings 20%. It is simple, memorable, and a fine starting point for a single salaried person. The weakness: in metros, rent alone can eat 40% of a young professional\'s income, so the ratio breaks immediately. If 50% does not cover needs, adjust to 60/20/20 and aim to move toward 50/30/20 as income grows.',
      },
      {
        h: 'Zero-based budgeting — the powerful one',
        p: 'Every rupee of income is assigned to a category at the start of the month. Rent, groceries, transport, entertainment, savings, investments — everything gets a number. The number does not need to be perfect; it needs to exist. Zero-based works because it forces explicit trade-offs. A ₹50,000 entertainment budget is possible if you have decided it is worth it. The failure mode is burnout — it takes real effort.',
      },
      {
        h: 'Pay-yourself-first — the behaviour hack',
        p: 'Automate investments and savings on salary day. The money leaves your account before you see it. What is left is your spending budget, by default. This is the single most effective method for people who hate tracking expenses, because it removes the tracking requirement entirely. The savings happen whether or not you have discipline.',
      },
      {
        h: 'The method that does not work',
        p: 'The "I will just spend less" method. Without a target, without automation, and without tracking, "spend less" translates to "spend about the same as always." It feels like a plan but contains no mechanism. Similarly, granular tracking apps do not help people who lack a system — they just generate data about a behaviour that is not changing.',
      },
      {
        h: 'The Indian reality',
        p: 'Most Indian households have irregular side income, joint family expenses, and one-off big costs like weddings and school fees. A pure percentage budget cannot handle these. The best Indian-adapted system is: pay-yourself-first for the automatic 20%, then a zero-based budget for the remaining 80% that absorbs side income and one-off expenses as they arrive.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  13. Retirement corpus number                                  */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'how-much-retirement-corpus-india',
    title: 'How much money do you actually need to retire in India?',
    description:
      'The 30× rule, the 4% rule, and why both are wrong for most Indians. Here is the calculation that fits your life.',
    date: '2025-12-12',
    readMins: 8,
    body: [
      {
        p: 'Ask ten financial advisors how much you need to retire and you will get eleven answers. The 30× annual expenses rule. The 4% safe withdrawal rule. The "your age minus 100 is your equity percentage" rule. All are starting points that fail in different ways. Here is how to build a number that fits you.',
      },
      {
        h: 'Start with today\'s expenses',
        p: 'Not your ideal retired expenses. Today\'s. If you spend ₹80,000 a month now, you will spend approximately the same in retirement, adjusted for inflation. The common mistake is assuming retirement expenses drop significantly. Some do (commuting, formal wear). Others rise (travel, healthcare, hobbies). They largely cancel out.',
      },
      {
        h: 'Inflate to retirement age',
        p: '₹80,000 a month at 6% inflation for 25 years becomes ₹3.4 lakh a month. This is the number you need to actually plan against. Most people work with today\'s number and end up 3–4× underprepared. The compounding works against you here — the target grows faster than most incomes.',
      },
      {
        h: 'The withdrawal rate problem',
        p: 'The 4% rule says you can withdraw 4% of your corpus in year one and increase it for inflation forever. It was derived from US data. Indian conditions are different — higher inflation (6–7%), shorter equity history, and healthcare costs rising faster than headline inflation. Conservative planners use 3–3.5% for India. That means a corpus 30–33× annual expenses instead of 25×.',
      },
      {
        h: 'The working number',
        p: 'For a 30-year-old planning to retire at 60: monthly expenses at retirement approximately ₹3.4 lakh, annual approximately ₹41 lakh, at 30× that is a corpus of roughly ₹12 crore. Add ₹1–2 crore for healthcare and emergencies. Subtract EPF, NPS, and any inheritance. This is the number to plan against — large, intimidating, and correct.',
      },
      {
        h: 'Why the number feels impossible',
        p: 'It feels impossible because most people do not start saving until their 30s. Someone who starts at 25 needs to invest ₹35,000 a month at 11% to hit ₹12 crore by 60. Someone who starts at 35 needs ₹85,000. The single biggest lever is not the return rate; it is the number of years compounding has to work. Every year of delay costs disproportionately more.',
      },
      {
        h: 'The realistic path',
        p: 'Do not aim for the full number today. Aim for the trajectory. Save 25–30% of income consistently. Increase the amount every year. Review the number every three years as expenses and inflation become clearer. Someone who starts this at 28 has a chance of retiring at 58. Someone who waits until 40 is working until 65, no matter what the calculation says.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  14. FIRE in India                                             */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'fire-in-india-reality-check',
    title: 'FIRE in India: what the movement gets right and where it fails',
    description:
      'Financial Independence, Retire Early sounds liberating. In Indian conditions, it works for a narrow band of people and fails for the rest.',
    date: '2025-12-08',
    readMins: 7,
    body: [
      {
        p: 'FIRE — Financial Independence, Retire Early — has a straightforward thesis: save aggressively (50%+ of income), invest in low-cost index funds, withdraw 4% a year once your portfolio is 25× annual expenses, and stop working. In Indian conditions, two of those four assumptions are shaky.',
      },
      {
        h: 'Where FIRE works',
        p: 'The savings-rate logic is universal. Someone earning ₹30 lakh a year in a metro, spending ₹12 lakh, and investing ₹18 lakh will reach financial independence in approximately 15 years. The math is real. The behaviour is achievable. For high earners with flexible spending, FIRE is a legitimate path.',
      },
      {
        h: 'The Indian inflation problem',
        p: 'The 4% rule assumes inflation runs at 2–3% like the US. India runs at 5–7%. Over 40 years of retirement, that difference compounds enormously. The Indian equivalent of the 4% rule is closer to 2.5–3%. That means a corpus of 33–40× annual expenses, not 25×. The FIRE number just got 40% larger.',
      },
      {
        h: 'The healthcare wildcard',
        p: 'Health insurance premiums rise 10–15% a year. A policy bought at 40 for ₹15,000 a year costs ₹50,000+ at 65. A single uninsured hospitalisation can wipe out years of savings. Most FIRE calculations completely ignore healthcare inflation. A ₹1 crore healthcare reserve on top of your FIRE number is not paranoia in Indian conditions.',
      },
      {
        h: 'The social pressure issue',
        p: 'Indian social life has implicit expectations: weddings, festivals, family obligations, helping siblings or parents. The US FIRE template assumes a relatively isolated household. Indian retirees are embedded in networks that produce real financial obligations. Budget for them. FIRE in a vacuum does not survive contact with family.',
      },
      {
        h: 'The realistic Indian FIRE',
        p: 'Coast FIRE — reach a point where existing investments will grow to your retirement number without further contributions, then work flexible jobs that cover current expenses. This is a much more achievable goal. Instead of saving 25–40× expenses, you need to save roughly 8–12× by your late 30s and then coast. It preserves the freedom without requiring the extreme deprivation.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  15. Gold                                                      */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'gold-as-investment-india',
    title: 'Is gold a good investment in India? The honest answer',
    description:
      'Gold has underperformed equity over 40 years but outperformed in every crisis. Here is what role it should actually play in your portfolio.',
    date: '2025-12-04',
    readMins: 6,
    body: [
      {
        p: 'Every Indian household has an opinion on gold, usually inherited from parents. Some treat it as the ultimate store of value. Others see it as a dead asset. Both are partially right. Gold is not an investment; it is insurance. Understanding that distinction changes everything.',
      },
      {
        h: 'The long-term numbers',
        p: 'Over the last 40 years, gold in India has returned roughly 9% a year in rupee terms. The Nifty has returned roughly 12%. Over 20 years, the gap widens: gold 11%, Nifty 13%. Over any 15-year period, equity beats gold in most historical windows. Over any 5-year period, gold sometimes wins — especially during equity bear markets and rupee depreciation.',
      },
      {
        h: 'When gold wins',
        p: 'Gold outperforms during: rupee depreciation (gold is priced in dollars), equity market crashes, geopolitical crises, and periods of high inflation. In 2020, when Nifty fell 25% in March, gold rose 25% over the year. In 2008 during the global financial crisis, gold held value while equity fell 50%. Gold is the asset you own so you do not have to sell your equity at the worst time.',
      },
      {
        h: 'The right allocation',
        p: '5–10% of your portfolio in gold is a reasonable range. Below 5%, the diversification benefit is minimal. Above 15%, you are giving up meaningful equity returns for marginal safety. The allocation is not about maximising returns; it is about not being forced to sell other assets at bad moments.',
      },
      {
        h: 'How to hold gold',
        p: 'Physical jewellery is the worst form. Making charges (10–25%), purity doubts, storage costs, and resale at a discount. Gold coins are slightly better. Gold ETFs are efficient but taxed as equity. Sovereign Gold Bonds were the best option — 2.5% coupon plus gold appreciation, tax-free on maturity — but new issuances have stopped. Gold mutual funds tracking ETFs are the practical answer today.',
      },
      {
        h: 'The cultural trap',
        p: 'A large portion of Indian household "gold investment" is wedding jewellery that will never be sold. This is not an investment — it is a consumption expense with resale value. Do not count it in your portfolio unless you would actually sell it in a crisis. Most people would not, which means it provides zero downside protection.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  16. Real estate vs equity                                     */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'real-estate-vs-equity-india',
    title: 'Real estate vs equity: which builds more wealth in India?',
    description:
      'Property has been the default Indian investment for decades. The data says equity has won. The truth is more nuanced.',
    date: '2025-11-30',
    readMins: 7,
    body: [
      {
        p: 'Indian households hold roughly 77% of their wealth in real estate and only 5% in equity. That allocation reflects generations of experience: property was safe, tangible, and appreciated. But the returns data over the last 20 years tells a different story than the cultural preference suggests.',
      },
      {
        h: 'The return comparison',
        p: 'Residential property in Indian metros has returned roughly 6–8% a year in capital appreciation over the last 20 years. Rental yields add 2–3%, for a total of 8–11%. The Nifty has returned 12–13% over the same period. Equity wins on gross returns. But this comparison ignores leverage, which is where real estate gets interesting.',
      },
      {
        h: 'The leverage factor',
        p: 'You cannot easily borrow ₹80 lakh at 8.5% to invest in an index fund. You can borrow that to buy property. If property appreciates 8% and your loan costs 8.5%, you are breaking even on appreciation but benefiting from the leverage. If property appreciates 12% in a good year, the leveraged return is 25%+. This is why property has produced more millionaires in India than equity — not because the asset is better, but because leverage amplifies the returns.',
      },
      {
        h: 'The hidden costs',
        p: 'Property has costs equity does not: stamp duty (5–7%), registration, brokerage, maintenance, property tax, and capital gains tax on sale. These consume 15–20% of the total return over the holding period. Additionally, property is illiquid — selling takes months. And rental income is taxed at your marginal rate, whereas equity long-term gains are taxed at 10–12.5%.',
      },
      {
        h: 'When property wins',
        p: 'Property wins when: you use leverage responsibly, hold for 10+ years in a growth corridor, and rent it out for meaningful income. Property is a business, not a passive investment. It works if you treat it like one — checking locations, negotiating rents, managing tenants. If you are not willing to do that, equity is a better passive investment.',
      },
      {
        h: 'The right allocation',
        p: 'A primary residence is not an investment; it is a consumption decision with tax benefits. Count it separately. For investment property, treat it like any other asset: does it offer diversification, cash flow, and appreciation that beats alternatives net of costs? For most people under 45, equity plus a REIT or two offers similar real estate exposure without the concentration risk and management overhead.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  17. Emergency fund alternatives                               */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'emergency-fund-alternatives-beyond-savings',
    title: 'Beyond savings: smart places to park your emergency fund',
    description:
      'A savings account earns 3%. Your emergency fund deserves better without sacrificing access. Five practical options compared.',
    date: '2025-11-26',
    readMins: 6,
    body: [
      {
        p: 'The conventional advice is to keep your emergency fund in a savings account. This is safe but expensive — you are giving up 3–4% annual returns on a large sum just for the psychological comfort of seeing it in your bank app. There are better options that maintain instant or near-instant access.',
      },
      {
        h: 'Sweep-in fixed deposits',
        p: 'Most major banks offer sweep-in FDs linked to a savings account. Any balance above a threshold (say ₹50,000) automatically moves into an FD earning 6.5–7%. When you need money, the sweep reverses instantly. You get FD returns with savings account liquidity. The catch: FD interest is taxed at your slab rate, so the post-tax return is 4.5–5% for a 30% taxpayer.',
      },
      {
        h: 'Liquid mutual funds',
        p: 'Liquid funds invest in short-term debt instruments and offer T+1 redemption (money hits your bank the next working day). Returns are 6.5–7%. Importantly, gains after 3 years are taxed at 20% with indexation, which for a high earner can be better than FD taxation. Some liquid funds also offer instant redemption up to ₹50,000 per day.',
      },
      {
        h: 'Arbitrage funds',
        p: 'Arbitrage funds exploit price differences between cash and futures markets. They are taxed as equity — 15% short-term, 10% long-term above ₹1 lakh. Returns are 6–7%, similar to liquid funds, but the taxation is significantly better for high earners. The downside: T+2 redemption, and returns can vary slightly month to month.',
      },
      {
        h: 'Recurring deposits',
        p: 'If you are building an emergency fund from scratch, an RD forces discipline. You commit to a fixed monthly contribution, and the bank deducts it automatically. Returns match FD rates. Once your fund is large enough, convert the RD to a liquid fund for better liquidity and taxation.',
      },
      {
        h: 'The tiered structure that works',
        p: 'Split the fund into two tiers. Tier 1: one month of expenses in a plain savings account — instant access, zero friction. Tier 2: the remaining 3–11 months in a liquid fund or arbitrage fund. This gives you immediate cash for small emergencies and near-instant access to the rest. The blended return is 5.5–6.5% post-tax, which is meaningfully better than a savings account.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  18. Salary structure and tax                                  */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'salary-structure-optimization-tax',
    title: 'How to structure your salary to legally reduce tax',
    description:
      'CTC is not take-home. How your salary is packaged — basic, HRA, allowances, and reimbursements — changes what you keep.',
    date: '2025-11-22',
    readMins: 7,
    body: [
      {
        p: 'Two people with ₹20 lakh CTC can take home very different amounts depending on how the package is structured. Basic salary, HRA, special allowance, LTA, and reimbursements all have different tax treatments. Most people accept whatever structure HR offers. A few optimise it and keep ₹1.5–2.5 lakh more per year.',
      },
      {
        h: 'The basic salary trap',
        p: 'Basic salary is fully taxable but it drives several other numbers: PF contribution (12% of basic), gratuity, and HRA exemption calculation. A higher basic means higher PF (good for retirement, but locks up cash) and a higher HRA cap if you rent. A lower basic reduces PF deductions and gives you more take-home today. The right basic depends on whether you value retirement savings more than current cash.',
      },
      {
        h: 'HRA — the biggest lever',
        p: 'If you pay rent, HRA exemption is the single largest tax-saving opportunity. The exemption is the minimum of: actual HRA received, 50% of basic (metro) or 40% (non-metro), and rent paid minus 10% of basic. A ₹20 lakh earner paying ₹35,000 rent in Bengaluru can exempt ₹4–5 lakh from tax with HRA alone. Make sure your salary structure has a substantial HRA component.',
      },
      {
        h: 'LTA and reimbursements',
        p: 'Leave Travel Allowance covers actual travel costs twice every four years. Telephone, internet, fuel, books, and professional development reimbursements are tax-free if backed by bills and part of the salary structure. If your employer offers these, use them. If they do not, ask HR whether the structure can be modified.',
      },
      {
        h: 'The meal card and NPS',
        p: 'Many employers offer meal cards (₹26,400 a year tax-free) and NPS employer contributions (up to 14% of basic under the new regime). Both are worth using if available. NPS employer contribution under 80CCD(2) is available even in the new regime — one of the few deductions that survived.',
      },
      {
        h: 'New vs old regime',
        p: 'Run both calculations before deciding. As a rough rule, if you have a home loan, rent, and significant 80C investments, the old regime usually wins above ₹15 lakh income. Below ₹10 lakh or without these deductions, the new regime almost always wins. The choice is made annually, so you are not locked in.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  19. Side income tax                                           */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'side-income-tax-rules-india',
    title: 'Side income and tax: what freelancers and creators need to know',
    description:
      'A salaried person earning ₹30,000 a month from consulting or content owes tax on it. How to declare, compute, and avoid notices.',
    date: '2025-11-18',
    readMins: 7,
    body: [
      {
        p: 'Roughly 15 million Indians earn some form of side income — consulting, freelance work, content creation, tuition, or online selling. Most do not declare it. Most get away with it, until they do not. A single IT notice for undeclared income can cost far more than the tax ever would have.',
      },
      {
        h: 'The three categories',
        p: 'Income from salary (from your employer) is taxed at slab rates with TDS. Income from other sources (interest, dividends, gifts, some consulting) is taxed at slab rates, usually without TDS unless it exceeds thresholds. Business income (freelance consulting, content creation, professional services) is taxed under Section 44ADA presumptive scheme if eligible, or on actual profit if not.',
      },
      {
        h: 'Section 44ADA for professionals',
        p: 'If you are a specified professional (engineer, doctor, lawyer, architect, accountant, technical consultant, interior designer, and others), you can declare 50% of gross receipts as income under 44ADA. You do not need to maintain detailed books. The limit for this scheme is ₹75 lakh gross receipts, provided less than 5% of receipts are in cash.',
      },
      {
        h: 'GST — the threshold nobody knows',
        p: 'For services, GST registration is required once annual turnover crosses ₹20 lakh (₹10 lakh in some special states). Export of services is zero-rated but still requires registration if you exceed the threshold. If you are approaching the limit, register early — retroactive registration triggers penalties.',
      },
      {
        h: 'TDS on your side income',
        p: 'If your clients are companies, they will deduct TDS at 10% under Section 194J (professional fees) or 2% under 194C (contract work). This TDS is visible in your Form 26AS and reduces your final tax liability. Many freelancers forget to claim it when filing, effectively overpaying. Match your 26AS entries with your invoices before filing.',
      },
      {
        h: 'Advance tax',
        p: 'If your total tax liability exceeds ₹10,000 a year, you must pay advance tax in four installments (15 June, 15 Sept, 15 Dec, 15 March). Failing to do so triggers interest under Sections 234B and 234C. Salaried people often ignore this because TDS handles their primary tax, then get caught when side income pushes them over the threshold. Pay advance tax on your side income quarterly.',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  20. Freelancer financial planning                             */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'financial-planning-for-freelancers-india',
    title: 'Financial planning for freelancers: the irregular income playbook',
    description:
      'No PF, no gratuity, no employer health insurance, no paid leave. Here is how to build the safety net your employer used to provide.',
    date: '2025-11-14',
    readMins: 8,
    body: [
      {
        p: 'A freelancer earning ₹25 lakh a year is not richer than a salaried person earning ₹18 lakh. The salaried person gets EPF, gratuity, employer health insurance, paid leave, and a predictable monthly cheque. The freelancer gets none of these. Once you account for the value of those benefits, the salaried package is often worth 25–35% more than the cash salary suggests.',
      },
      {
        h: 'The emergency fund is bigger',
        p: 'Three months is not enough. Freelancers need 6–9 months of expenses, because income can dry up for two or three months at a time without warning. A single long project delay can create a six-month gap. The fund is not a luxury; it is the mechanism that lets you say no to bad projects without taking a cash-flow hit.',
      },
      {
        h: 'Health insurance is non-negotiable',
        p: 'You have no employer cover. A personal policy with ₹10 lakh sum insured is the minimum. Add a super top-up for ₹15 lakh more. Once you cross 35, add a critical illness policy that pays a lump sum on diagnosis of cancer, heart attack, or stroke. Without this, one hospitalisation can wipe out three years of savings.',
      },
      {
        h: 'Retirement requires deliberate saving',
        p: 'No EPF means no forced retirement saving. Open a PPF account and contribute the maximum ₹1.5 lakh annually. Additionally, invest in equity mutual funds through a systematic withdrawal plan or monthly SIP. The goal: replace the 12% of basic that an employer would have contributed to PF, plus the 12% you would have contributed. That is roughly 24% of your income that needs to go into retirement instruments.',
      },
      {
        h: 'Tax structure — the freelancer\'s advantage',
        p: 'As a professional under Section 44ADA, you only pay tax on 50% of gross receipts (up to ₹75 lakh). This is a massive advantage over salaried employees. A freelancer grossing ₹30 lakh pays tax on ₹15 lakh, whereas a salaried person earning ₹15 lakh pays tax on the full amount. Use this advantage by optimising the structure — invoices to companies, GST registration when required, and careful documentation.',
      },
      {
        h: 'The buffer against slow months',
        p: 'Open a separate "income smoothing" account. Every time a large payment arrives, transfer 30% of it to this account. In slow months, draw a fixed "salary" from it. This converts irregular freelance income into a predictable monthly paycheque for yourself. It is the single biggest mental health improvement most freelancers make.',
      },
      {
        h: 'Insurance beyond health',
        p: 'Term insurance matters more for freelancers than salaried people because there is no employer life cover. Buy ₹2–3 crore term cover if you have dependents. Also consider professional indemnity insurance if your work exposes you to claims. Finally, disability insurance (personal accident cover) protects against the scenario where you cannot work but do not die — the worst case for a freelancer, because your income depends entirely on your ability to work.',
      },
      {
        h: 'The structure that works',
        p: 'Automate four things on the first of every month: a transfer to the emergency fund, a transfer to the retirement account, a payment toward the health insurance premium (or a monthly allocation to cover the annual premium), and a transfer to the income-smoothing buffer. What remains in the operating account is your spending money. This structure replaces every safety net a salaried job provides. It requires discipline, but the payoff is genuine independence.',
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════ */
/*  Selectors                                                         */
/* ══════════════════════════════════════════════════════════════════ */

export const getPost = (slug: string): Post | undefined =>
  POSTS.find((p) => p.slug === slug);

/** Posts sorted newest-first. Useful for the index and related rails. */
export const getSortedPosts = (): Post[] =>
  [...POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

/** Related posts for a given slug — newest-first, excludes current. */
export const getRelatedPosts = (slug: string, limit = 3): Post[] =>
  getSortedPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, limit);