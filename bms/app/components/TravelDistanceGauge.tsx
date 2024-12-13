const TravelDistanceGauge: React.FC<{ travelDistance: number }> = ({
  travelDistance,
}) => {
  const maxTravelDistance = 500; // Maximum travel distance

  // Calculate the angle and position of the dot
  const angle = (travelDistance / maxTravelDistance) * 180; // Scale travel distance to a 180° arc
  const angleRadians = (angle * Math.PI) / 180; // Convert angle to radians
  const radius = 40; // Reduced radius for smaller size
  const centerX = 50; // Center X coordinate of the circle
  const centerY = 50; // Center Y coordinate of the circle
  const dotCx = centerX + radius * Math.cos(Math.PI - angleRadians); // Corrected X position
  const dotCy = centerY - radius * Math.sin(Math.PI - angleRadians); // Corrected Y position

  // Define the gradient for the arc
  const GradientDef = (
    <defs>
      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ff0000" /> {/* Red */}
        <stop offset="50%" stopColor="#FFFF00" /> {/* Yellow */}
        <stop offset="100%" stopColor="#00ff00" /> {/* Green */}
      </linearGradient>
    </defs>
  );

  return (
    <div className="relative">
      <svg
        width="100"
        height="70"
        viewBox="0 0 100 50"
        preserveAspectRatio="xMidYMid meet"
      >
        {GradientDef}

        {/* Gauge arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          stroke="url(#gaugeGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Travel distance text */}
        <text
          x="50"
          y="40" // Lowered slightly to center within the gauge
          textAnchor="middle"
          className="text-[14px] font-bold text-[#0D1319] dark:text-white"
        >
          {travelDistance.toFixed(1)} km
        </text>

        {/* Dot */}
        <circle cx={dotCx} cy={dotCy} r="3" fill="#0D1319" />
      </svg>
    </div>
  );
};

export default TravelDistanceGauge;
