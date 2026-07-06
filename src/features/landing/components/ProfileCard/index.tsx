import { GlassPanel } from "@/components/ui/GlassPanel/GlassPanel";

import styles from "./ProfileCard.module.css";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#", icon: "/images/icons/linkedin.svg" },
  { label: "GitHub", href: "#", icon: "/images/icons/github.svg" },
  { label: "Email", href: "#", icon: "/images/icons/mail.svg" },
  { label: "Resume", href: "#", icon: "/images/icons/resume.svg" },
];

export function ProfileCard() {
  return (
    <GlassPanel as="section" aria-label="Profile card" className={styles.root}>
      <img src="/images/profile/kumail.png" alt="Kumail N" className={styles.avatar} />

      <h2 className={styles.name}>Kumail N</h2>

      <p className={styles.roles}>
        <span>Solution Architect</span>
        <span className={styles.roleDivider}>•</span>
        <span>Cloud Engineer</span>
        <span className={styles.roleDivider}>•</span>
        <span>AI Engineer</span>
      </p>

      <p className={styles.intro}>
        I design and build cloud-native, AI-powered systems end-to-end — from architecture to
        production.
      </p>

      <div className={styles.actions}>
        {SOCIAL_LINKS.map((link) => (
          <a key={link.label} href={link.href} aria-label={link.label} className={styles.action}>
            <img src={link.icon} alt="" className={styles.actionIcon} />
          </a>
        ))}
      </div>
    </GlassPanel>
  );
}
