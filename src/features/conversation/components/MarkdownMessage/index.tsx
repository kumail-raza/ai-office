"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "../CodeBlock";

import styles from "./MarkdownMessage.module.css";

const components: Components = {
  pre: ({ children }) => <>{children}</>,
  code({ className, children }) {
    const match = /language-(\w+)/.exec(className ?? "");
    const text = String(children).replace(/\n$/, "");

    if (match) {
      return <CodeBlock code={text} language={match[1]} />;
    }
    return <code className={styles.inlineCode}>{children}</code>;
  },
};

export function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className={styles.markdown}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
