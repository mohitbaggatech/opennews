import Menu from "./menu";

export default function Layout({ children }: any) {
  return (
    <>
      <Menu />
      <div className="w-full sm:w-9/12" style={{ marginLeft: 'auto'}}>
      <main className="pt-4">{children}</main>
      </div>
    </>
  )
}