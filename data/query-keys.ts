export const queryKeys = {
  leads: (vertical: string) => ["leads", vertical] as const,
  activities: (leadId: number) => ["activities", leadId] as const,
}
