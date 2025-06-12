export const CentangIcon = () => (
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="text-green-500"
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  {/* Lingkaran luar */}
  <circle cx="12" cy="12" r="12" stroke="#565759" fill="#565759" />

  {/* Centang */}
  <path d="M5 13l4 4L19 7" stroke="currentColor" />
</svg>

);

export const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="text-yellow-500"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
    />
  </svg>
);
