import { redirect } from 'next/navigation';

export default function NotFound() {
  // Redirect ไปยังหน้า Login
  redirect('/login');
}