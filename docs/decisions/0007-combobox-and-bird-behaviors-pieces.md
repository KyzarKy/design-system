# ADR 0007: Combobox, and the pieces Bird Behaviors had kept to itself

**Status:** proposed, 2026-11-20. Accepted when the pull request merges. Ky asked for a way to
type to find a bird on a phone, built here, and for Bird Behaviors' other hand-written pieces to
move here at the same time.

## Context

Bird Behaviors picks a species from a couple hundred with a `Select` on phones. Finding the
Cackling Goose meant scrolling the whole list by hand. A native `<select>` can't filter, and
`<datalist>` doesn't help: Safari on iPhone shows its suggestions in a bar above the keyboard,
without groups, and it hands back the label text instead of a value.

The app also wrote its own sidebar row, tag, text box, and checkbox from the tokens, with a note
that they'd move here once a second app needed them.

## Decision

**`Combobox`** is a text box over a list, following the ARIA 1.2 combobox pattern. Focusing it
opens the whole list; typing narrows it to options whose label or `keywords` contain the text,
ignoring case and punctuation. Arrow keys and Enter pick from the keyboard, Escape closes, and a
tap picks and puts the keyboard away. Options can have groups, shown as headings, like a
`Select`'s `optgroup`.

This is the "Hard" column ADR 0006 turned down for `Select`: keyboard, screen reader, and phone
behavior are ours. It's taken here because no native element filters. `Select` stays the choice
for a short list.

**`Input`** is a text box with `Select`'s look. Both now share a `ui-input` utility in
`theme.css`; `ui-select` adds the caret. This settles "text inputs" from ADR 0006's "Not decided
here". Textareas stay undecided.

**`Checkbox`**, **`NavLink`**, and **`Tag`** move from Bird Behaviors as they were. `Tag` gains the
`success` and `destructive` tones, and the theme test now checks `primary` on its badge too.

## Not decided here

- **Matching beyond "contains".** No fuzzy matching or typo tolerance. "Canada" finds Canada
  Goose; "cnada" doesn't.
- **A list that opens upward** when the text box is near the bottom of the screen. Both uses so
  far sit near the top of the page.
