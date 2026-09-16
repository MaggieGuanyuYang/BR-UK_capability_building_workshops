import { Fragment } from "react";

// Allow line breaks after a slash without adding or changing source characters.
export function StrategyTitle({ title }: { title: string }) {
  return title.split("/").map((part, index, parts) => (
    <Fragment key={index}>
      {part}
      {index < parts.length - 1 && (
        <>
          {"/"}
          <wbr />
        </>
      )}
    </Fragment>
  ));
}
