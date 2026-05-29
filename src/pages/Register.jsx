import React from "react";
import Login from "./Login";

export default function Register() {
  // Render Login component langsung di mode register
  return <Login initialTab="register" />;
}
