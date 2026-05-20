function BrandLogo({ className = "" }) {
  return (
    <svg
      className={className}
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BiblioConnect"
    >
      <rect x="4" y="7" width="14" height="20" rx="3.5" fill="#1E3A5F" />
      <rect x="14" y="10" width="14" height="20" rx="3.5" fill="#E67E00" />
      <rect x="24" y="13" width="14" height="20" rx="3.5" fill="#4A90E2" />
      <path
        d="M8 30.5C10.2 29.6 12.1 29.2 14.7 29.2C17.3 29.2 19.4 29.8 21 30.5C22.6 31.2 24.7 31.8 27.3 31.8C29.9 31.8 31.8 31.3 34 30.5"
        stroke="#F8FAFC"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 34C10.2 33.1 12.1 32.7 14.7 32.7C17.3 32.7 19.4 33.3 21 34C22.6 34.7 24.7 35.3 27.3 35.3C29.9 35.3 31.8 34.8 34 34"
        stroke="#F8FAFC"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default BrandLogo;