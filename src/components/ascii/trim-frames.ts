"use client";

function countLeadingBlankLines(lines: string[]) {
  let count = 0;

  while (count < lines.length && /^[ \t]*$/.test(lines[count])) {
    count += 1;
  }

  return count;
}

function countTrailingBlankLines(lines: string[]) {
  let count = 0;

  while (
    count < lines.length &&
    /^[ \t]*$/.test(lines[lines.length - 1 - count])
  ) {
    count += 1;
  }

  return count;
}

export function trimAsciiFrames(frames: string[]) {
  if (frames.length === 0) return frames;

  const splitFrames = frames.map((frame) => frame.split(/\r?\n/));

  const topTrim = Math.min(
    ...splitFrames.map((lines) => countLeadingBlankLines(lines)),
  );
  const bottomTrim = Math.min(
    ...splitFrames.map((lines) => countTrailingBlankLines(lines)),
  );

  const croppedFrames = splitFrames.map((lines) =>
    lines.slice(topTrim, lines.length - bottomTrim),
  );

  const nonEmptyLines = croppedFrames.flatMap((lines) =>
    lines.filter((line) => !/^[ \t]*$/.test(line)),
  );

  if (nonEmptyLines.length === 0) {
    return croppedFrames.map((lines) => lines.join("\n"));
  }

  const leftTrim = Math.min(
    ...nonEmptyLines.map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0),
  );
  const rightTrim = Math.min(
    ...nonEmptyLines.map((line) => line.match(/[ \t]*$/)?.[0].length ?? 0),
  );

  return croppedFrames.map((lines) =>
    lines
      .map((line) => {
        const start = Math.min(leftTrim, line.length);
        const end =
          rightTrim > 0
            ? Math.max(start, line.length - rightTrim)
            : line.length;

        return line.slice(start, end);
      })
      .join("\n"),
  );
}
