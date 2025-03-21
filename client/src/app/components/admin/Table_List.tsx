import React from "react";
import { User } from "@/utils/Types/interfaces";
import { useRouter } from "next/navigation";
import InfoIcon from "@mui/icons-material/Info";
import { FARMER, MANAGER } from "@/utils/Paths/paths";

function Table_List({ users, idxCalc }: { users: User[]; idxCalc: number }) {
  const router = useRouter();

  const handleOnView = async (user_id: string, role: string) => {
    if (role === "Manager") {
      router.push(`${MANAGER}/${user_id}`);
    } else {
      router.push(`${FARMER}/${user_id}`);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg shadow-2xl">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full table-fixed">
            <thead>
              <tr className="font-bold bg-customGreen text-white text-table-head-size">
                <td className="px-4 py-3 text-left w-[100px]">S. No.</td>
                <td className="px-4 py-3 text-left">ID</td>
                <td className="px-4 py-3 text-left">Name</td>
                <td className="px-4 py-3 text-left">Email</td>
                <td className="px-4 py-3 text-left">Phone</td>
                <td className="px-4 py-3 text-left">Role</td>
                <td className="px-4 py-3 text-right">Info</td>
              </tr>
            </thead>

            <tbody className="text-table-body-size">
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="text-black bg-customGreen bg-opacity-10 odd:bg-opacity-5 border-b-[1px] border-black last:border-b-0"
                >
                  <td className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {idxCalc + index + 1}
                  </td>
                  <td
                    className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                    title={user.uniqueID}
                  >
                    {user.uniqueID}
                  </td>
                  <td
                    className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                    title={user.name}
                  >
                    {user.name}
                  </td>
                  <td
                    className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                    title={user.email}
                  >
                    {user.email}
                  </td>
                  <td
                    className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                    title={String(user.phone)}
                  >
                    {user.phone}
                  </td>
                  <td
                    className="px-4 py-3 align-middle w-[100px] min-w-[80px] lg:min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                    title={user.role}
                  >
                    {user.role}
                  </td>
                  <td className="px-4 text-end">
                    <InfoIcon
                      style={{
                        color: "#31473A",
                        cursor: "pointer",
                        fontSize: "30px",
                      }}
                      onClick={() => handleOnView(user.uniqueID, user.role)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Table_List;
