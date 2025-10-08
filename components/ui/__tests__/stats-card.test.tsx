import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatsCard } from "../stats-card";
import { Users } from "lucide-react";

describe("StatsCard", () => {
  const defaultProps = {
    title: "Total Patients",
    value: 1247,
    icon: Users,
    color: "text-blue-600",
    bgGradient: "from-blue-500/10 to-blue-600/5",
    change: "+12%",
    trend: "up" as const,
  };

  it("renders with all props", () => {
    render(<StatsCard {...defaultProps} />);
    expect(screen.getByText("Total Patients")).toBeInTheDocument();
    expect(screen.getByText("1247")).toBeInTheDocument();
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("renders without change prop", () => {
    const { change, ...props } = defaultProps;
    render(<StatsCard {...props} />);
    expect(screen.getByText("Total Patients")).toBeInTheDocument();
    expect(screen.queryByText("+12%")).not.toBeInTheDocument();
  });

  it("renders with down trend", () => {
    render(<StatsCard {...defaultProps} trend="down" change="-5%" />);
    expect(screen.getByText("-5%")).toBeInTheDocument();
  });

  it("renders with neutral trend", () => {
    render(<StatsCard {...defaultProps} trend="neutral" change="0%" />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders with numeric value", () => {
    render(<StatsCard {...defaultProps} value={1247} />);
    expect(screen.getByText("1247")).toBeInTheDocument();
  });
});
