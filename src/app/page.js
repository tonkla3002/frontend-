import Image from "next/image";
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect ไปยังหน้า Login
  redirect('/login');
  

}
