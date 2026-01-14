import fg from "fast-glob";

export interface ScanOptions {
  include?: string;
  exclude?: string;
}

export async function scanTemplates(
  inputDir: string,
  options: ScanOptions = {}
): Promise<string[]> {
  const pattern = options.include
    ? `${inputDir}/${options.include}`
    : `${inputDir}/**/*.md`;

  const ignore = options.exclude ? [`${inputDir}/${options.exclude}`] : [];

  return fg(pattern, { ignore });
}
