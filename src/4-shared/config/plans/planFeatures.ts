export const PLAN_FEATURES = {
  free: {
    basicRsvp: true,
    headcount: false,
    dietary: false,
    guestComments: false,
    bulkInvite: false,
    bulkGuestAdd: false,
    rsvpAnalytics: false,
    exportGuestList: false,
    prioritySupport: false,
    unlimitedLanguages: false,
    giftRegistry: false,
    promoBrandDomain: false, // No own domain
  },
  premium: {
    basicRsvp: true,
    headcount: true,
    dietary: true,
    guestComments: true,
    bulkInvite: true,
    bulkGuestAdd: true,
    rsvpAnalytics: true,
    exportGuestList: true,
    prioritySupport: true,
    unlimitedLanguages: true,
    giftRegistry: true,
    promoBrandDomain: true, // Has own domain
  },
} as const;

export type PlanFeatures = typeof PLAN_FEATURES;
