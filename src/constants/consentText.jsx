export const TERMS_CONSENT_DEF = {
  version_label: "terms.v1-2025-08-29",
  header: "Acceptance of Our Electricity Offer",
  leadin: "By accepting our offer, you agree, understand and consent to:",
  bullets: [
    {
      parts: [
        () => `agreeing to enter into `,
        {
          type: "link",
          hrefKey: "contractUrl",
          label: "iO Energy’s market contract",
        },
        " for electricity at your supply address;",
      ],
    },
    {
      parts: [
        () => `having read iO Energy's `,
        { type: "link", hrefKey: "privacyPolicyUrl", label: "Privacy Policy" },
        ", which explains how we handle, use and disclose your personal information, including your rights to access and correct it;",
      ],
    },
    {
      text: () =>
        "authorising iO Energy to transfer your account from your current retailer;",
    },
    {
      text: () =>
        "having the right to cancel your contract within 10 Business Days from the day you receive your welcome pack;",
    },
    {
      text: () =>
        "understanding that exit fees may apply if you end your contract early, and that conditional fees (e.g. late payment, dishonour, card surcharge) may apply;",
    },
    {
      text: () =>
        "understanding that tariffs, charges, or benefits may change, and consenting to such variations with notice;",
    },
    {
      text: () =>
        "consenting to being placed on a shortened collection cycle if you miss payments;",
    },
    {
      text: () =>
        "confirming whether anyone at the supply address relies on life support equipment (protections apply immediately);",
    },
    {
      text: () =>
        "understanding you may cancel this contract within 10 Business Days of receiving your welcome pack, at no cost.",
    },
  ],
};

export const DIRECT_DEBIT_DEF = {
  version_label: "dd.v1-2025-08-08",
  header: "Direct Debit Authorisation",
  bullets: [
    {
      text: () =>
        "I confirm that I am the sole owner of the account details entered.",
    },
    {
      text: ({ retailerName }) =>
        `I request and authorise ${retailerName} to arrange for full account payment of any amount that ${retailerName} may debit or charge me from my nominated account identified above.`,
    },
    {
      parts: [
        ({ schemeLabel }) =>
          `I understand that my account will be debited through ${schemeLabel} and this authority remains in force in accordance with the `,
        {
          type: "link",
          hrefKey: "directDebitAgreementUrl",
          label: "Direct Debit Service Agreement",
        },
      ],
    },
  ],
};

import { Link } from "@mui/material";

export function renderBullets(def, vars = {}, urls = {}) {
  const items = def?.bullets ?? [];
  return items.map((b, i) => {
    // 1) parts[] with strings/functions/links
    if (Array.isArray(b?.parts)) {
      return (
        <li key={i} style={{ marginLeft: "1.25rem" }}>
          {b.parts.map((p, j) => {
            // function part → evaluate
            if (typeof p === "function") {
              const val = p(vars, urls);
              return <span key={j}>{val}</span>;
            }
            // plain string
            if (typeof p === "string") {
              return <span key={j}>{p}</span>;
            }
            // link object
            if (p && p.type === "link") {
              const href = p.href || (p.hrefKey ? urls[p.hrefKey] : undefined);
              const label =
                typeof p.label === "function" ? p.label(vars, urls) : p.label;
              if (!href) return <span key={j}>{label}</span>;
              return (
                <Link
                  key={j}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </Link>
              );
            }
            return null;
          })}
        </li>
      );
    }

    // 2) optional jsx() override
    if (typeof b?.jsx === "function") {
      return (
        <li key={i} style={{ marginLeft: "1.25rem" }}>
          {b.jsx(vars, urls)}
        </li>
      );
    }

    // 3) legacy .text() / function / string
    const txt =
      typeof b?.text === "function"
        ? b.text(vars, urls)
        : typeof b === "function"
        ? b(vars, urls)
        : String(b ?? "");

    return (
      <li key={i} style={{ marginLeft: "1.25rem" }}>
        {txt}
      </li>
    );
  });
}

export function buildPlainTextFromDef(def, vars = {}, urls = {}) {
  const header = def?.header || "";
  const leadin = def?.leadin || "";
  const lines = (def?.bullets ?? []).map((b) => {
    if (Array.isArray(b?.parts)) {
      // Collapse parts to plain text (links → label only)
      return b.parts
        .map((p) => {
          if (typeof p === "function") return p(vars, urls) ?? "";
          if (typeof p === "string") return p;
          if (p && p.type === "link") {
            return typeof p.label === "function"
              ? p.label(vars, urls)
              : p.label || "";
          }
          return "";
        })
        .join("");
    }
    if (typeof b?.text === "function") return b.text(vars, urls);
    if (typeof b === "function") return b(vars, urls);
    return String(b ?? "");
  });

  return [header, leadin, ...lines.map((t) => `• ${t}`)].join("\n");
}
