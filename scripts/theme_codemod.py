import re, pathlib

MAP = {
    "text-[#8192a7]": "text-fg-subtle", "text-[#041627]": "text-fg-strong", "text-[#44474c]": "text-fg-muted",
    "text-[#191c1e]": "text-fg", "text-[#006397]": "text-accent", "text-[#ba1a1a]": "text-danger-fg",
    "text-[#93000a]": "text-danger-ink", "text-[#c4c6cd]": "text-fg-faint",
    "border-[#e6e8ea]": "border-line", "border-[#eceef0]": "border-line-soft", "border-[#c4c6cd]": "border-line-strong",
    "border-[#006397]": "border-accent", "border-[#ffb4ab]": "border-danger-line", "border-[#f7f9fb]": "border-line-soft",
    "border-[#cce5ff]": "border-accent-soft", "border-[#ba1a1a]": "border-danger-fg", "border-[#8192a7]": "border-fg-subtle",
    "divide-[#f7f9fb]": "divide-line-soft", "divide-[#eceef0]": "divide-line-soft", "divide-[#e6e8ea]": "divide-line",
    "ring-[#006397]": "ring-accent", "outline-[#006397]": "outline-accent",
    "bg-[#eceef0]": "bg-surface-2", "bg-[#f7f9fb]": "bg-canvas", "bg-[#006397]": "bg-accent-solid",
    "bg-[#004d7a]": "bg-accent-solid-hover", "bg-[#041627]": "bg-ink-solid", "bg-[#ffdad6]": "bg-danger-soft",
    "bg-[#fddede]": "bg-danger-soft", "bg-[#cce5ff]": "bg-accent-soft", "bg-[#eaf4fa]": "bg-accent-tint",
    "bg-[#e3f2fa]": "bg-accent-tint", "bg-[#e0e3e5]": "bg-surface-3", "bg-[#dfe3e6]": "bg-surface-3",
    "bg-[#c4c6cd]": "bg-line-strong", "bg-[#ba1a1a]": "bg-danger-solid", "bg-[#8192a7]": "bg-fg-subtle",
    "bg-[#1a2b3c]": "bg-ink-2", "bg-[#34475a]": "bg-ink-3",
}
pat = re.compile(r"(?<![\w-])(" + "|".join(re.escape(k) for k in MAP) + r")", re.I)
white = re.compile(r"(?<![\w-])(bg|from|via|to)-white(?![\w/-])")

for f in pathlib.Path("/app/src").rglob("*.tsx"):
    s = f.read_text()
    n = pat.sub(lambda m: MAP[m.group(1).lower()], s)
    n = white.sub(lambda m: f"{m.group(1)}-card", n)
    if f.name == "SideNav.tsx":
        n = n.replace("bg-ink-solid", "bg-sidebar")
    if n != s:
        f.write_text(n)
        print("updated", f)
