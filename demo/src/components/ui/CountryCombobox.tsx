import { useEffect, useMemo, useRef, useState } from "react";
import { useCombobox } from "downshift";
import { getAllCountries } from "postal-code-checker";
import styles from "./CountryCombobox.module.scss";

type Option = { code: string; name: string };

type Props = {
  value: string;
  onChange: (countryCode: string) => void;
  id?: string;
  ariaLabel?: string;
  placeholder?: string;
};

function buildOptions(): Option[] {
  return getAllCountries()
    .map((c) => ({ code: c.countryCode, name: c.countryName }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function CountryCombobox({
  value,
  onChange,
  id,
  ariaLabel,
  placeholder = "Search country…",
}: Props) {
  const options = useMemo(buildOptions, []);

  const selected = useMemo(
    () => options.find((o) => o.code === value) ?? null,
    [options, value],
  );

  const [inputValue, setInputValue] = useState(selected?.name ?? "");

  // Keep the displayed text in sync when the country is changed externally
  // (e.g. DatasetPanel row click in the Playground).
  useEffect(() => {
    setInputValue(selected?.name ?? "");
  }, [selected]);

  const filtered = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q || q === selected?.name.toLowerCase()) return options;
    return options.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.code.toLowerCase().includes(q),
    );
  }, [inputValue, options, selected]);

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen,
    highlightedIndex,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    openMenu,
  } = useCombobox({
    items: filtered,
    itemToString: (item) => (item ? item.name : ""),
    selectedItem: selected,
    inputValue,
    onInputValueChange: ({ inputValue: next }) => setInputValue(next ?? ""),
    onSelectedItemChange: ({ selectedItem: next }) => {
      if (next && next.code !== value) onChange(next.code);
    },
    id,
  });

  return (
    <div className={styles.wrap}>
      <div className={styles.combobox}>
        <input
          className={styles.input}
          placeholder={placeholder}
          {...getInputProps({ "aria-label": ariaLabel, ref: inputRef })}
        />
        {inputValue && (
          <button
            type="button"
            className={styles.clear}
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setInputValue("");
              openMenu();
              inputRef.current?.focus();
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        )}
        <button
          type="button"
          className={styles.toggle}
          data-open={isOpen}
          aria-label={isOpen ? "Close country list" : "Open country list"}
          {...getToggleButtonProps()}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <ul
          {...getMenuProps()}
          className={styles.menu}
          data-open={isOpen}
        >
          {isOpen && filtered.length === 0 && (
            <li className={styles.empty}>
              No countries match &ldquo;{inputValue}&rdquo;.
            </li>
          )}
          {isOpen &&
            filtered.map((item, index) => {
              const highlighted = highlightedIndex === index;
              const isSelected = selected?.code === item.code;
              return (
                <li
                  key={item.code}
                  {...getItemProps({ item, index })}
                  className={[
                    styles.item,
                    highlighted && styles.itemHighlighted,
                    isSelected && styles.itemSelected,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className={styles.itemName}>{item.name}</span>
                  {isSelected && (
                    <span className={styles.check} aria-hidden="true">
                      ✓
                    </span>
                  )}
                  <span className={styles.code}>{item.code}</span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
