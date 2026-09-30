// Usage: pnpm exec tsx scripts/prepare-startup-week-students.ts input.csv output.csv
// Writes a new CSV for Supabase import. Does not connect to or mutate the database.
import { readFileSync, writeFileSync } from "node:fs";
import { profileFields, selectionValues } from "../lib/startup-week/student-profile-fields";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false, closed = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {cell += '"'; i++;}
        else {quoted = false; closed = true;}
      } else cell += char;
    } else if (char === '"' && !cell && !closed) quoted = true;
    else if (char === ",") {row.push(cell); cell = ""; closed = false;}
    else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = ""; closed = false;
    } else {
      if (closed && char.trim()) throw new Error("Unexpected content after a closing CSV quote.");
      if (!closed) cell += char;
    }
  }
  if (quoted) throw new Error("Unclosed quoted field in CSV.");
  if (cell || row.length || closed) rows.push([...row, cell]);
  return rows;
}
const normalize = (value: string) => value.replace(/^\uFEFF/, "").replace(/<br\s*\/?\s*>/gi, "").replace(/[‘’]/g, "'").replace(/[–—]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();
const fields = [{key: "name", headers: ["Name"]}, ...profileFields, ...["id"].map(key => ({key, headers: [key]}))];
const aliases = new Map(fields.flatMap(field => [field.key, ...(field.headers || [])].map(header => [normalize(header), field.key] as const)));
const ignoredHeaders = new Set(["relocation", "Where would you relocate to work?"].map(normalize));
const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
try {
  const [input, output, ...extra] = process.argv.slice(2);
  if (!input || !output || extra.length) throw new Error("Usage: pnpm exec tsx scripts/prepare-startup-week-students.ts input.csv output.csv");
  const [headers, ...rows] = parseCsv(readFileSync(input, "utf8"));
  if (!headers) throw new Error("CSV is empty.");
  const mapped = headers.map(header => aliases.get(normalize(header)));
  const columns = [...new Set(mapped.filter(Boolean))].filter(key => !["project_url", "project_description"].includes(key as string)) as string[];
  for (const key of ["project_url", "project_description"]) {
    if (mapped.includes(key)) columns.push(key);
  }
  if (!columns.includes("name") || !columns.includes("email")) throw new Error("CSV must include Name and Email columns.");
  const duplicate = columns.find(key => !["expertise", "project_url"].includes(key) && mapped.filter(value => value === key).length > 1);
  if (duplicate) throw new Error(`Multiple CSV columns map to ${duplicate}. Rename or remove the duplicate column.`);
  const unknown = headers.filter((header, index) => header.trim() && !mapped[index] && !ignoredHeaders.has(normalize(header)));
  if (unknown.length) throw new Error(`Unrecognized CSV columns: ${unknown.join(", ")}. Remove these columns or add an explicit mapping before importing.`);
  let extraProjectLinks = 0;
  const outputRows = rows.filter(row => row.some(value => value.trim())).map((row, index) => {
    if (row.length !== headers.length) throw new Error(`CSV row ${index + 2} has ${row.length} fields; expected ${headers.length}.`);
    const values = columns.map(key => {
      const indices = mapped.flatMap((value, i) => value === key ? [i] : []);
      // Prefer the primary link regardless of the source CSV column order.
      if (key === "project_url") indices.sort((a, b) => {
        const primary = (i: number) => ["project_url", "project link"].includes(normalize(headers[i])) ? 0 : 1;
        return primary(a) - primary(b);
      });
      const answers = indices.map(i => row[i].trim()).filter(Boolean);
      if (key === "expertise") return selectionValues(answers.flatMap(selectionValues)).map(value => /[",]/.test(value) ? quote(value) : value).join(", ");
      if (key === "project_url" && new Set(answers).size > 1) extraProjectLinks++;
      return answers[0] || "";
    });
    if (!values[columns.indexOf("name")] || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[columns.indexOf("email")])) throw new Error(`CSV row ${index + 2} needs a name and valid email.`);
    return values;
  });
  writeFileSync(output, [columns, ...outputRows].map(row => row.map(quote).join(",")).join("\r\n") + "\r\n", {flag: "wx"});
  if (headers.some(header => ignoredHeaders.has(normalize(header)))) console.log("Relocation columns were omitted.");
  if (extraProjectLinks) console.log(`${extraProjectLinks} rows had different project links; the primary Project link was kept.`);
  console.log(`Prepared ${outputRows.length} students across ${columns.length} columns. Import the output CSV into startup_week_students after applying the student profile migration.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Could not prepare CSV.");
  process.exitCode = 1;
}
