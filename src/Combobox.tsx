// One choice from a long list, found by typing (ADR 0007). A text box that shows the chosen
// option; focusing it opens the whole list, and typing narrows it to the options whose label
// or keywords contain what's typed, ignoring case and punctuation. Arrow keys move through
// the list, Enter picks, Escape closes, and a tap picks and puts the keyboard away.
//
// The ARIA 1.2 combobox pattern: focus stays in the text box and aria-activedescendant says
// which option is highlighted, so a screen reader reads it. For a short list, use Select.
// Name it with a <label htmlFor> or `aria-label`. `className` is for placing it (max-w-xs).

import { useEffect, useId, useRef, useState } from "react";
import { joinClasses } from "./joinClasses.js";

export interface ComboboxOption<Value extends string> {
  value: Value;
  label: string;
  /** Options in a row with the same group sit under it as a heading. */
  group?: string;
  /** More text to match, not shown: a scientific name, a code. */
  keywords?: string;
}

interface ComboboxProps<Value extends string> {
  options: readonly ComboboxOption<Value>[];
  value: Value | undefined;
  onChange: (value: Value) => void;
  id?: string;
  "aria-label"?: string;
  /** Shown when nothing is chosen. While the list is open, the chosen label shows instead. */
  placeholder?: string;
  className?: string;
}

/** Lowercase, apostrophes dropped (so "coopers" finds "Cooper's"), other punctuation as spaces. */
export function fold(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function Combobox<Value extends string>({
  options,
  value,
  onChange,
  id,
  "aria-label": ariaLabel,
  placeholder,
  className,
}: ComboboxProps<Value>) {
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  // null while closed; what's typed while open.
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(-1);
  const open = query !== null;
  const chosen = options.find((option) => option.value === value);
  const q = fold(query ?? "");
  const shown = q
    ? options.filter((option) => fold(`${option.label} ${option.keywords ?? ""}`).includes(q))
    : options;

  useEffect(() => {
    if (open)
      list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = () => {
    setQuery("");
    setActive(chosen ? options.indexOf(chosen) : 0);
  };
  const close = () => {
    setQuery(null);
    setActive(-1);
  };
  const pick = (option: ComboboxOption<Value>) => {
    close();
    if (option.value !== value) onChange(option.value);
  };

  // Consecutive options with the same group share a heading.
  const groups: { name?: string; items: { option: ComboboxOption<Value>; index: number }[] }[] = [];
  shown.forEach((option, index) => {
    const last = groups.at(-1);
    if (last && last.name === option.group) last.items.push({ option, index });
    else groups.push({ name: option.group, items: [{ option, index }] });
  });

  const renderOption = ({ option, index }: { option: ComboboxOption<Value>; index: number }) => (
    // biome-ignore lint/a11y/useKeyWithClickEvents: the keys are handled on the text box, which keeps focus.
    <div
      key={option.value}
      id={`${listId}-${index}`}
      data-index={index}
      role="option"
      tabIndex={-1}
      aria-selected={option.value === value}
      // Keeps focus in the text box, so it doesn't close the list before the click lands.
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => {
        pick(option);
        input.current?.blur();
      }}
      className={joinClasses(
        "flex min-h-11 cursor-pointer items-center rounded-lg px-3 hover:bg-muted",
        index === active ? "bg-muted outline-2 outline-ring -outline-offset-2" : undefined,
        option.value === value ? "font-semibold text-primary" : undefined,
      )}
    >
      {option.label}
    </div>
  );

  return (
    <div className={joinClasses("relative", className)}>
      <input
        ref={input}
        id={id}
        type="text"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && shown[active] ? `${listId}-${active}` : undefined}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="done"
        className="ui-input pr-10"
        value={query ?? chosen?.label ?? ""}
        placeholder={open ? (chosen?.label ?? placeholder) : placeholder}
        onFocus={openList}
        onBlur={close}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) return openList();
            const step = event.key === "ArrowDown" ? 1 : -1;
            setActive((index) => Math.min(Math.max(index + step, 0), shown.length - 1));
          } else if (event.key === "Enter" && open) {
            event.preventDefault();
            const option = shown[active];
            if (option) pick(option);
          } else if (event.key === "Escape" && open) {
            event.preventDefault();
            close();
          }
        }}
      />
      <svg
        aria-hidden="true"
        width="12"
        height="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-input"
      >
        <path d="M1 1.5l5 5 5-5" />
      </svg>
      <div
        hidden={!open}
        className="absolute inset-x-0 top-full z-10 mt-1 max-h-[min(20rem,50dvh)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-card p-1 text-card-foreground shadow-lg"
      >
        <div ref={list} id={listId} role="listbox" aria-label={ariaLabel}>
          {groups.map((group, g) =>
            group.name === undefined ? (
              group.items.map(renderOption)
            ) : (
              // biome-ignore lint/a11y/useSemanticElements: a listbox's groups are role="group"; a fieldset isn't allowed in one.
              <div
                key={group.items[0]?.option.value}
                role="group"
                aria-labelledby={`${listId}-g${g}`}
              >
                <div
                  id={`${listId}-g${g}`}
                  className="px-3 pt-2 pb-1 text-muted-foreground text-xs"
                >
                  {group.name}
                </div>
                {group.items.map(renderOption)}
              </div>
            ),
          )}
        </div>
        {shown.length === 0 && <p className="px-3 py-2 text-muted-foreground">No matches</p>}
      </div>
    </div>
  );
}
