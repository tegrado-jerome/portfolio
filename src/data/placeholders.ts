// Helpers for publishing only real content — placeholders like "[EMAIL]" or "#" never
// reach structured data, llms.txt or other machine-readable output.

export const isSet = (value?: string | null): value is string =>
  !!value && value.trim() !== "" && value !== "#" && !/^\[.*\]$/.test(value.trim());

export const onlySet = (values: (string | undefined)[]) => values.filter(isSet);
