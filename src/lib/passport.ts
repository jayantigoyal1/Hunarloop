type PublicProfile = { name: string; interests: string[]; skills: string[]; goals: string[] };

// Explicit allowlist: adding private fields to the store cannot expose them here.
export function employerPreview(profile: PublicProfile): PublicProfile {
  return { name: profile.name, interests: [...profile.interests], skills: [...profile.skills], goals: [...profile.goals] };
}

export function uniqueItems(items: string[]): string[] {
  const seen = new Set<string>();
  return items.map((item) => item.trim()).filter((item) => {
    const key = item.toLocaleLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
