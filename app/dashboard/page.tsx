import { auth } from "@/auth"
import { signOut } from "@/auth"

export default async function Dashboard() {
  const session = await auth()

  return (
    <div>
      <div>ID: { session?.user?.id }</div>
      <div>Name: { session?.user?.name }</div>

      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </div>
  )
}