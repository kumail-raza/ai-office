"use client";

import { CONTACT_CONFIG } from "../../constants/contactConfig";
import { recruiterAnalytics } from "../../services/RecruiterAnalytics";

import styles from "./sections.module.css";

const LINKS = [
  { label: "LinkedIn", icon: "🔗", href: CONTACT_CONFIG.linkedinUrl, channel: "linkedin" },
  { label: "GitHub", icon: "🐙", href: CONTACT_CONFIG.githubUrl, channel: "github" },
  { label: "Email", icon: "✉️", href: `mailto:${CONTACT_CONFIG.email}`, channel: "email" },
  { label: "Schedule a Meeting", icon: "📅", href: CONTACT_CONFIG.scheduleUrl, channel: "schedule" },
];

export function ContactSection() {
  return (
    <div>
      <h2 className={styles.heading}>Contact</h2>

      <div className={styles.contactList}>
        {LINKS.map((link) => (
          <a
            key={link.channel}
            href={link.href}
            className={styles.contactLink}
            onClick={() => recruiterAnalytics.trackContactClick(link.channel)}
          >
            <span aria-hidden="true">{link.icon}</span>
            {link.label}
          </a>
        ))}

        <a
          href={CONTACT_CONFIG.resumeUrl}
          className={styles.primaryAction}
          onClick={() => recruiterAnalytics.trackResumeDownload()}
          download
        >
          📄 Download Resume
        </a>
      </div>
    </div>
  );
}
