type IconProps = {
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
};
export const MailIcon = ({ className, href, target, rel }: IconProps) =>
  href ? (
    <a href={href} target={target} rel={rel} className={className}>
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <title>Email</title>
        <path d="M17.187 19.181L24 4.755 0 12.386l9.196 1.963.043 4.896 2.759-2.617-2.147-2.076 7.336 4.63z" />
      </svg>
    </a>
  ) : (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <title>Email</title>
      <path d="M17.187 19.181L24 4.755 0 12.386l9.196 1.963.043 4.896 2.759-2.617-2.147-2.076 7.336 4.63z" />
    </svg>
  );
