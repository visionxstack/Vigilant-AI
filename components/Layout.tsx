import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}
