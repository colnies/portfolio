import { Github, Linkedin, Mail, type LucideIcon } from "lucide-react";

export const site = {
  name: "Colin Nies",
  email: "contact@colinnies.dev",
  githubUsername: "colnies",
  employer: { name: "UKG", url: "https://ukg.com" },
};

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/colnies", icon: Github },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/colin-nies",
    icon: Linkedin,
  },
  { label: "Email", href: `mailto:${site.email}`, icon: Mail },
];
