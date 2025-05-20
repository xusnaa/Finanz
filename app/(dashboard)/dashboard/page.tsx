// "use client";
// import { Supabase } from "@/lib/supabase";

// import React, { useEffect, useState } from "react";
// import { User } from "@/lib/types";

// const Home = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   useEffect(() => {
//     const users = async () => {
//       const { data, error } = await Supabase.from("Users").select("*");
//       if (error) {
//         console.error("Error fetching users:", error);
//       } else {
//         setUsers(data);
//         console.log(data);
//       }
//     };

//     users();
//   }, []);
//   return (
//     <>
//       <ul className="text-black">
//         {users.map((user) => (
//           <li key={user.id}>
//             {user.firstName} {user.latName}
//           </li>
//         ))}
//       </ul>
//       <div>This is an authenticated route</div>
//     </>
//   );
// };

// export default Home;
