export const site = {
  name: "Colin Nies",
  email: "contact@colinnies.dev",
  githubUsername: "colnies",
  employer: { name: "UKG", url: "https://ukg.com" },
};

export interface SocialLink {
  label: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/colnies" },
  { label: "LinkedIn", href: "https://linkedin.com/in/colin-nies" },
  { label: "Email", href: `mailto:${site.email}` },
];
