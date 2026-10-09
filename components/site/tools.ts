export type Tool = {
  slug: string;
  title: string;
  description: string;
  groupId: string;
};

export type ToolGroup = {
  id: string;
  title: string;
};

export const toolGroups: ToolGroup[] = [
  {
    id: "environmental-foraging",
    title: "Environmental & Foraging",
  },
  {
    id: "stargazing-outdoor",
    title: "Stargazing and Outdoor conditions",
  },
  {
    id: "weather",
    title: "Weather",
  },
];

export const tools: Tool[] = [
  {
    slug: "foraging-index",
    title: "Foraging index",
    description:
      "Check recent rain, warmth after rain, soil temperature, and season. This tool advises on weather conditions only, bring your own knowledge of what you forage.",
    groupId: "environmental-foraging",
  },
  {
    slug: "dark-sky-window",
    title: "Dark sky window",
    description:
      "Find prime stargazing hours from moon phase, clouds, air clarity, and estimated light pollution.",
    groupId: "stargazing-outdoor",
  },
  {
    slug: "historical-weather",
    title: "Historical weather",
    description:
      "Look up a past day, compare it to today, or line up several dates side by side. Highs, lows, rain, and frost.",
    groupId: "weather",
  },
];

export function toolHref(slug: string): string {
  return `/utilities/${slug}`;
}

export function toolsInGroup(groupId: string): Tool[] {
  return tools.filter((tool) => tool.groupId === groupId);
}
