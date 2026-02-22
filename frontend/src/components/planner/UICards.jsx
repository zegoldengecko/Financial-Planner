import React from "react";
import {
  LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  CARD_BORDER_RADIUS,
  CARD_BOX_SHADOW,
  CARD_BORDER_LEFT_WIDTH,
  CARD_VALUE_FONT_SIZE,
  TABLE_HEADER_FONT_SIZE,
  TABLE_ROW_FONT_SIZE,
  TABLE_ROW_PADDING,
  PIE_OUTER_RADIUS,
  LINE_STROKE_WIDTH,
  REGRESSION_LINE_DASHARRAY,
  REGRESSION_LINE_OPACITY,
  CHART_GRID_DASHARRAY,
  CARD_GAP
} from "../../utils/constants.js";

// ---------- STAT CARDS ----------
export const StatCard = ({ title, value, colour }) => (
  <div style={{
    flex: 1,
    padding: CARD_GAP,
    backgroundColor: "#fff",
    borderRadius: CARD_BORDER_RADIUS,
    boxShadow: CARD_BOX_SHADOW,
    borderLeft: `${CARD_BORDER_LEFT_WIDTH}px solid ${colour}`
  }}>
    <h4>{title}</h4>
    <p style={{ fontSize: CARD_VALUE_FONT_SIZE, fontWeight: "bold", color: colour }}>{value}</p>
  </div>
);

// ---------- TRANSACTION RANK CARD ----------
export const TransactionRankCard = ({ title, items, addPlus }) => (
  <div style={{
    flex: 1,
    padding: CARD_GAP,
    backgroundColor: "#f9fafb",
    borderRadius: CARD_BORDER_RADIUS,
    boxShadow: CARD_BOX_SHADOW
  }}>
    <h4>{title}</h4>
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      fontWeight: "600",
      fontSize: TABLE_HEADER_FONT_SIZE,
      marginBottom: "6px"
    }}>
      <span>Category</span>
      <span>Amount</span>
      <span>Date</span>
    </div>
    {items.map((item, index) => (
      <div key={index} style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        fontSize: TABLE_ROW_FONT_SIZE,
        padding: TABLE_ROW_PADDING,
        borderTop: "1px solid #e5e7eb"
      }}>
        <span>{item.category}</span>
        <span>{addPlus}${item.amount}</span>
        <span>{item.date}</span>
      </div>
    ))}
  </div>
);

// ---------- PIE GRAPH ----------
export const PieGraphCard = ({ title, data }) => (
  <div style={{
    flex: 1,
    padding: CARD_GAP,
    backgroundColor: "#f9fafb",
    borderRadius: CARD_BORDER_RADIUS,
    boxShadow: CARD_BOX_SHADOW,
    display: "flex",
    flexDirection: "column"
  }}>
    <h4>{title}</h4>
    <div style={{ flex: 1 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={PIE_OUTER_RADIUS} label>
            {data.map((_, index) => (
              <Cell key={index} fill={["#3b82f6", "#22c55e", "#f59e0b", "#a855f7"][index % 4]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ---------- REGRESSION HELPER ----------
export const getRegression = (data, keyX, keyY) => {
  const n = data.length;
  if (n === 0) return [];
  const xVals = data.map((d, i) => i + 1);
  const yVals = data.map(d => d[keyY] || 0);

  const sumX = xVals.reduce((a, b) => a + b, 0);
  const sumY = yVals.reduce((a, b) => a + b, 0);
  const sumXY = xVals.reduce((sum, x, i) => sum + x * yVals[i], 0);
  const sumX2 = xVals.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map((d, i) => ({ ...d, [`${keyY}_regression`]: intercept + slope * (i + 1) }));
};

// ---------- GRAPH CARD ----------
export const GraphCard = ({ title, data = [], lines = [], dataKeyX = "month" }) => {
  let regressionData = [...data];
  lines.forEach(line => regressionData = getRegression(regressionData, dataKeyX, line.dataKey));

  return (
    <div style={{
      flex: 1,
      padding: CARD_GAP,
      backgroundColor: "#f9fafb",
      borderRadius: CARD_BORDER_RADIUS,
      boxShadow: CARD_BOX_SHADOW,
      display: "flex",
      flexDirection: "column"
    }}>
      <h4>{title}</h4>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={regressionData}>
            <CartesianGrid strokeDasharray={CHART_GRID_DASHARRAY} />
            <XAxis dataKey={dataKeyX} />
            <YAxis />
            <Tooltip formatter={(value, name) => name?.includes("_regression") ? null : value} />
            <Legend />
            {lines.map((line, idx) => <Line key={idx} type="monotone" dataKey={line.dataKey} stroke={line.color} strokeWidth={LINE_STROKE_WIDTH} />)}
            {lines.map((line, idx) => <Line key={`regression-${idx}`} type="monotone" dataKey={`${line.dataKey}_regression`} stroke={line.color} strokeWidth={LINE_STROKE_WIDTH} strokeDasharray={REGRESSION_LINE_DASHARRAY} opacity={REGRESSION_LINE_OPACITY} dot={false} legendType="none" />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ---------- BAR GRAPH ----------
export const BarGraphCard = ({ title, data = [], bars = [], dataKeyX = "month", reverseColours = false }) => (
  <div style={{
    flex: 1,
    padding: CARD_GAP,
    backgroundColor: "#f9fafb",
    borderRadius: CARD_BORDER_RADIUS,
    boxShadow: CARD_BOX_SHADOW,
    display: "flex",
    flexDirection: "column"
  }}>
    <h4>{title}</h4>
    <div style={{ flex: 1 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray={CHART_GRID_DASHARRAY} />
          <XAxis dataKey={dataKeyX} />
          <YAxis />
          <Tooltip formatter={(value) => `${value >= 0 ? "+" : "-"}$${Math.abs(value).toLocaleString()}`} />
          {bars.map((bar, idx) => (
            <Bar key={idx} dataKey={bar.dataKey}>
              {data.map((entry, i) => (
                <Cell key={i} fill={reverseColours ? (entry[bar.dataKey] >= 0 ? "#ef4444" : "#22c55e") : (entry[bar.dataKey] >= 0 ? "#22c55e" : "#ef4444")} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ---------- FORECAST CARD (UNIMPLEMENTED) ----------
export const ForecastCard = ({ title }) => (
  <div style={{
    padding: CARD_GAP,
    backgroundColor: "#f9fafb",
    borderRadius: CARD_BORDER_RADIUS,
    boxShadow: CARD_BOX_SHADOW
  }}>
    <h4>{title}</h4>
    <p>Forecast content here</p>
  </div>
);
