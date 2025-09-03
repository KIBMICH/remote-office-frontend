"use client";
import React from "react";
import Button from "../../../components/ui/Button";

export default function RegisterCompanyPage() {
  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Register Company</h1>
      <form className="flex flex-col gap-3">
        <input className="p-2 border" placeholder="Company name" />
        <input className="p-2 border" placeholder="Admin email" />
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
