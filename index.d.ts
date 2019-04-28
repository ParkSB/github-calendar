declare interface CalendarOptions {
  summary_text: string;
  global_stats: boolean;
  responsive: boolean;
  proxy: (url: string) => string;
}

declare class GitHubCalendar {
  constructor(container: string | HTMLElement, username: string, options: CalendarOptions)
}
