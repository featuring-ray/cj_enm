"use client";

interface Tab {
  key: string;
  label: string;
}

interface OtrTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
}

export function OtrTabBar({ tabs, activeTab, onChange }: OtrTabBarProps) {
  return (
    <div className="flex gap-1 border-b border-[var(--otr-border)] mb-3">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          style={{
            padding: "8px 20px",
            fontSize: "var(--otr-font-body)",
            fontWeight: activeTab === tab.key ? 700 : 400,
            color: activeTab === tab.key ? "var(--otr-accent-purple)" : "var(--otr-text-secondary)",
            borderBottom: activeTab === tab.key ? "2px solid var(--otr-accent-purple)" : "2px solid transparent",
            background: "transparent",
            cursor: "pointer",
            transition: "all 0.15s",
            marginBottom: "-1px",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
