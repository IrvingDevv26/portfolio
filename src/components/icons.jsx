/* Iconos SVG inline, sin dependencias. Heredan el color con currentColor
   y el tamaño con className (por defecto h-5 w-5). */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const make =
  (children, props = stroke) =>
  ({ className = "h-5 w-5" }) => (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      {children}
    </svg>
  );

const solid = { fill: "currentColor" };

export const GithubIcon = make(
  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />,
  solid,
);

export const LinkedinIcon = make(
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
  solid,
);

export const CheckIcon = make(<path d="M5 12.5l4.5 4.5L19 7.5" />);

export const DownIcon = make(<path d="M12 5v14m0 0l-5-5m5 5l5-5" />);

export const ArrowLeftIcon = make(<path d="M19 12H5m0 0l5-5m-5 5l5 5" />);

export const UploadIcon = make(
  <path d="M12 16V4m0 0L7 9m5-5l5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />,
);

export const FileIcon = make(
  <>
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </>,
);

export const CopyIcon = make(
  <>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 012-2h9" />
  </>,
);

export const XIcon = make(<path d="M6 6l12 12M18 6L6 18" />);

export const AlertIcon = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5m0 3.5h.01" />
  </>,
);

export const DownloadIcon = make(
  <path d="M12 4v12m0 0l-5-5m5 5l5-5M4 20h16" />,
);

export const ArrowUpIcon = make(<path d="M12 19V5m0 0l-5 5m5-5l5 5" />);

export const PlayIcon = make(<path d="M8 5.5v13l11-6.5-11-6.5z" />);

export const ArrowRightIcon = make(<path d="M5 12h14m0 0l-5-5m5 5l-5 5" />);

export const ArrowUpRightIcon = make(<path d="M7 17L17 7m0 0H8m9 0v9" />);

export const MailIcon = make(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 6.5l8.5 6 8.5-6" />
  </>,
);

/* Servicios */

export const WorkflowIcon = make(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <path d="M10 6.5h4a3 3 0 013 3V14M14 17.5h-4a3 3 0 01-3-3V10" />
  </>,
);

export const TableIcon = make(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9.5h18M3 15h18M9.5 9.5V20" />
  </>,
);

export const CodeIcon = make(<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15" />);

export const ServerIcon = make(
  <>
    <rect x="3.5" y="4" width="17" height="7" rx="1.5" />
    <rect x="3.5" y="13" width="17" height="7" rx="1.5" />
    <path d="M7.5 7.5h.01M7.5 16.5h.01M11 7.5h5.5M11 16.5h5.5" />
  </>,
);

export const CloudIcon = make(
  <path d="M7 18.5h10.5a4 4 0 00.6-7.96A6 6 0 006.6 9.1 4.75 4.75 0 007 18.5z" />,
);
