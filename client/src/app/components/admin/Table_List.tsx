import React from "react";
import { User } from "@/utils/Types/interfaces";
import { useRouter } from "next/navigation";

function Table_List({ users, url }: { users: User[]; url: string }) {
  const router = useRouter();

  const handleOnView = async (user_id: string) => {
    router.push(`${url}/${user_id}`);
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg overflow-hidden">
            <table className="w-full text-[10px] md:text-[13px] lg:text-[16px] table-fixed">
        <thead>
        <tr className="text-start font-bold bg-gray-600 text-white">
            <td className="px-2 py-4 border-y-2">ID</td>
            <td className="px-2 py-4 border-y-2">Name</td>
            <td className="px-2 py-4 border-y-2">Email</td>
            <td className="px-2 py-4 border-y-2">Phone</td>
            <td className="px-2 py-4 border-y-2"></td>
          </tr>
        </thead>

        <tbody className="text-[9px] md:text-[12px] lg:text-[16px]">
          {users.map((user, index) => (
            <tr key={index} className="text-start text-black bg-gray-200">
              <td
                className="px-2 py-4 border-y-2 w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                title={user.uniqueID}
              >
                {user.uniqueID}
              </td>
              <td
                className="px-2 py-4 border-y-2 w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                title={user.name}
              >
                {user.name}
              </td>
              <td
                className="px-2 py-4 border-y-2 w-[150px] min-w-[120px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                title={user.email}
              >
                {user.email}
              </td>
              <td
                className="px-2 py-4 border-y-2 w-[100px] min-w-[80px] lg:min-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                title={String(user.phone)}
              >
                {user.phone}
              </td>
              {/* <td className="px-2 py-4 border-y-2 w-[120px] min-w-[100px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                {new Date(user.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </td> */}
              <td className="px-2 border-y-2 text-end">
                <button
                  className="w-[30px] md:w-[50px] lg:w-[100px] bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white py-2 rounded-sm duration-200"
                  onClick={() => handleOnView(user._id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table_List;
