import { useState } from "react";
import {
  relevantStrategies,
  strategies,
  strategyNumber,
  type Role,
} from "../data/strategies";
import { Icon } from "./Icon";

const CX = 270,
  CY = 263,
  R = 176;
const coordinates = strategies.map((_, index) => {
  const angle = ((index * 36 - 90) * Math.PI) / 180;
  const x = CX + R * Math.cos(angle),
    y = CY + R * Math.sin(angle);
  return { x, y, angle };
});

export function NetworkGraphic({
  role,
  selected,
  onSelect,
  decorative = false,
}: {
  role: Role;
  selected: number;
  onSelect?: (id: number) => void;
  decorative?: boolean;
}) {
  const relevant = relevantStrategies(role.id);
  return (
    <svg
      className="network"
      viewBox="0 0 540 535"
      aria-label={
        decorative
          ? undefined
          : `Strategy map for ${role.label}. ${relevant.length} relevant strategies. Select a numbered strategy to read its actions.`
      }
      role={decorative ? undefined : "group"}
      aria-hidden={decorative || undefined}
    >
      <g className="network-links" aria-hidden="true">
        {coordinates.map(({ x, y }, index) => {
          const active = relevant.some((item) => item.id === index + 1);
          const midX = CX + (x - CX) * 0.55 + (y - CY) * 0.11;
          const midY = CY + (y - CY) * 0.55 - (x - CX) * 0.11;
          return (
            <path
              key={index}
              className={active ? "is-relevant" : ""}
              d={`M${CX},${CY} Q${midX},${midY} ${x},${y}`}
            />
          );
        })}
      </g>
      <circle className="network-centre" cx={CX} cy={CY} r="96" />
      <text
        className={`centre-title ${role.lines.length > 1 ? "multiline" : ""}`}
        x={CX}
        textAnchor="middle"
        aria-hidden="true"
      >
        {role.lines.map((line, index) => (
          <tspan
            key={line}
            x={CX}
            y={CY - (role.lines.length - 1) * 13 + index * 26 - 5}
          >
            {line}
          </tspan>
        ))}
      </text>
      <text
        className="centre-count"
        x={CX}
        y={CY + (role.lines.length - 1) * 13 + 22}
        textAnchor="middle"
        aria-hidden="true"
      >
        {relevant.length} relevant strategies
      </text>
      {strategies.map((strategy, index) => {
        const { x, y } = coordinates[index];
        const active = strategy.roles.includes(role.id);
        const top = index === 0,
          bottom = index === 5;
        const left = index > 5;
        const textX = top || bottom ? x : x + (left ? -41 : 41);
        const textY = top ? y - 58 : bottom ? y + 55 : y - 6;
        const labelWidth =
          Math.max(...strategy.short.map((line) => line.length)) * 9.5;
        const hitX =
          top || bottom ? x - 80 : left ? x - 41 - labelWidth : x - 42;
        const hitY = top ? textY - 19 : y - 42;
        const hitWidth = top || bottom ? 160 : 83 + labelWidth;
        const hitHeight = bottom ? 119 : top ? y + 42 - hitY : 84;
        const label = `Strategy ${strategy.id}: ${strategy.short.join(" ")}. ${active ? "Relevant to your role" : "Not mapped to your role in Table 3"}`;
        return (
          <g
            key={strategy.id}
            className={`network-node ${active ? "is-relevant" : ""} ${selected === strategy.id ? "is-selected" : ""}`}
            role={decorative ? undefined : "button"}
            tabIndex={decorative ? undefined : 0}
            aria-label={decorative ? undefined : label}
            aria-pressed={decorative ? undefined : selected === strategy.id}
            onClick={() => onSelect?.(strategy.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.(strategy.id);
              }
            }}
          >
            <title>{label}</title>
            <rect
              className="node-hit"
              x={hitX}
              y={hitY}
              width={hitWidth}
              height={hitHeight}
              fill="transparent"
            />
            <circle className="node-focus" cx={x} cy={y} r="36" />
            <circle className="node-circle" cx={x} cy={y} r="30" />
            <text
              className="node-number"
              x={x}
              y={y + 6}
              textAnchor="middle"
              aria-hidden="true"
            >
              {strategyNumber(strategy.id)}
            </text>
            <text
              className="node-label"
              x={textX}
              textAnchor={top || bottom ? "middle" : left ? "end" : "start"}
              aria-hidden="true"
            >
              {strategy.short.map((line, lineIndex) => (
                <tspan key={line} x={textX} y={textY + lineIndex * 18}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function StrategyMap({
  role,
  selected,
  onSelect,
}: {
  role: Role;
  selected: number;
  onSelect: (id: number) => void;
}) {
  const [list, setList] = useState(false);
  return (
    <section className="map-column" aria-labelledby="map-heading">
      <h2 className="step-heading" id="map-heading">
        <span>02</span>Explore your strategies
      </h2>
      <div className="map-content">
        {list ? (
          <div
            className="strategy-list"
            role="group"
            aria-label={`All strategies for ${role.label}`}
          >
            {strategies.map((strategy) => (
              <button
                key={strategy.id}
                className={`strategy-list-row ${strategy.id === selected ? "is-selected" : ""}`}
                onClick={() => onSelect(strategy.id)}
                aria-pressed={strategy.id === selected}
              >
                <span
                  className={`list-number ${strategy.roles.includes(role.id) ? "is-relevant" : ""}`}
                >
                  {strategyNumber(strategy.id)}
                </span>
                <span>
                  {strategy.short.join(" ")}
                  <small>
                    {strategy.roles.includes(role.id)
                      ? "Relevant to your role"
                      : "Explore another strategy"}
                  </small>
                </span>
                <Icon name="arrow" size={17} />
              </button>
            ))}
          </div>
        ) : (
          <NetworkGraphic role={role} selected={selected} onSelect={onSelect} />
        )}
      </div>
      <div className="map-key">
        <div className="legend">
          <span>
            <i className="legend-dot active" />
            Relevant to your role
          </span>
          <span>
            <i className="legend-dot" />
            Explore other strategies
          </span>
        </div>
        <button
          className="text-button view-toggle"
          onClick={() => setList((value) => !value)}
        >
          {list ? "View as a map" : "View as a list"}
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </section>
  );
}
