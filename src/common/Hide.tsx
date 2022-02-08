export default function Hide({ children, when }: any) {
  if (when) {
    return null;
  }
  return <>{children}</>;
}
