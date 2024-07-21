import { auth } from "@/auth"

export default async function Dashboard() {
  const session = await auth()

  return (
    <div>
      <div>ID: { session?.user?.id }</div>
      <div>Name: { session?.user?.name }</div>
    </div>
  )
}