export interface Post { slug: string; title: string; description: string; date: string; readMins: number; body: { h?: string; p: string }[] }
export const POSTS: Post[] = [
  { slug: 'how-big-should-your-emergency-fund-be', title: 'How big should your emergency fund be?', date: '2026-09-15', readMins: 4,
    description: 'A practical way to size an emergency fund using essential monthly expenses, job stability and dependents.',
    body: [
      { p: 'An emergency fund is money you can reach within a day or two, kept for job loss, medical bills or urgent repairs. The usual starting point is three to six months of essential expenses.' },
      { h: 'Start with essentials, not total spending', p: 'Rent or EMI, groceries, utilities, insurance premiums, school fees and transport count. Subscriptions and dining out do not. Divide your liquid savings by that essential number to get your months of cover.' },
      { h: 'When to aim higher', p: 'Variable income, one earning member, dependents or health conditions all argue for the upper end, and sometimes beyond six months.' },
      { h: 'What counts as liquid', p: 'Savings accounts and sweep-in fixed deposits usually qualify. Property, gold jewellery and long lock-in schemes do not.' },
    ] },
  { slug: 'what-is-a-good-savings-rate', title: 'What is a good savings rate?', date: '2026-09-18', readMins: 3,
    description: 'Savings rate explained: how to calculate it, why EMIs matter, and how to read your result.',
    body: [
      { p: 'Savings rate is the share of your income left after spending and debt payments. If you earn ₹85,000 and ₹24,000 is left, your rate is about 28%.' },
      { h: 'Use recurring income only', p: 'A one-time bonus can make a month look strong. Ratios are more honest when based on regular income and regular spending.' },
      { h: 'There is no universal target', p: 'A useful number depends on your goals, age and obligations. Compare yourself with your own trend before comparing with anyone else.' },
    ] },
  { slug: 'debt-service-ratio-explained', title: 'Debt-service ratio: how much EMI is too much?', date: '2026-09-22', readMins: 4,
    description: 'Understand the debt-service ratio, how lenders and planners read it, and how to set a personal limit.',
    body: [
      { p: 'Your debt-service ratio is total monthly loan payments divided by monthly income. A ₹30,000 EMI total on ₹85,000 income gives about 35%.' },
      { h: 'Include every payment', p: 'Home, vehicle, education and personal loans, plus minimum credit card dues. Missing one understates the ratio.' },
      { h: 'Pick a limit that fits your life', p: 'Many people use roughly 40% as a ceiling, but a family with high essential spending may want less. FinSight lets you set your own threshold.' },
    ] },
];
export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
