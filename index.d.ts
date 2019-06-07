interface Options {
  summary_text?: string;
  poxy?: (url: string) => string;
  global_stats?: boolean;
  responsive?: boolean;
}

declare class githubCalendar {
  constructor(container: string | HTMLElement | null, username: string, opti1ons?: Options)
}

export default githubCalendar;
