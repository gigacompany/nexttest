import React from "react"
import Transactiontable from "./reports"
import SignOutButton from "./signout"

export default function Home() {
  return (
   <section>
    <h1>This is Home</h1>
    <Transactiontable/>
    <SignOutButton/>
   </section>
  )
}
