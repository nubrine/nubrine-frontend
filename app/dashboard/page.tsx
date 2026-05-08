"use client";
import AuthProvider from "../provider/AuthProvider";
import { useAuthStore } from "../stores/auth";

export default function DashboardPage() {
  const {user, status} = useAuthStore()
  return (

    <div>
      <div>
        <p>Dashboard</p>
      </div>
      <div>
        <p> {user?.email} </p>
        <p> {status} </p>
        <button> Create a trip </button>
      </div>
      </div>
  );
}   