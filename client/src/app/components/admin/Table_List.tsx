import React from "react";
import { User } from "@/utils/Types/interfaces";
import { useRouter } from "next/navigation";
import InfoIcon from "@mui/icons-material/Info";

function Table_List({
  users,
  idxCalc,
  url,
}: {
  users: User[];
  idxCalc: number;
  url: string;
}) {
  const router = useRouter();

  const handleOnView = async (user_id: string) => {
    router.push(`${url}/${user_id}`);
  };

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg shadow-2xl">
        <table className="w-full text-[10px] md:text-[13px] lg:text-[16px] table-fixed">
          <thead>
            <tr className="font-bold bg-primarycColor bg-opacity-80 text-white">
              <td className="px-4 py-3 text-left">S. No.</td>
              <td className="px-4 py-3 text-left">ID</td>
              <td className="px-4 py-3 text-left">Name</td>
              <td className="px-4 py-3 text-left">Email</td>
              <td className="px-4 py-3 text-left">Phone</td>
              <td className="px-4 py-3 text-left">Joined on</td>
              <td className="px-4 py-3 text-left"></td>
            </tr>
          </thead>

          <tbody className="text-[9px] md:text-[12px] lg:text-[16px]">
            {users.map((user, index) => (
              <tr
                key={index}
                className="text-black bg-secondaryColor odd:bg-opacity-30 border-b-[1px] border-black last:border-b-0"
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
                  title={String(user.phone)}
                >
                  {new Date(user.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </td>
                <td className="px-4 text-end">
                  <InfoIcon
                    style={{
                      color: "#31473A",
                      cursor: "pointer",
                      fontSize: "30px",
                    }}
                    onClick={() => handleOnView(user.uniqueID)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table_List;
