"use client";
import React from "react";
import Button from "../../../components/ui/Button";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <form className="flex flex-col gap-3">
        <input className="p-2 border" placeholder="Email" />
        <input className="p-2 border" placeholder="Password" type="password" />
        <Button type="submit">Sign in</Button>
      </form>
    </div>
  );
}
