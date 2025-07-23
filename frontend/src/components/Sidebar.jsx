import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) =>
    (user.fullName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = () => {
    if (groupName && selectedMembers.length > 0) {
      // Placeholder for backend API call to create group
      const groupData = {
        name: groupName,
        members: selectedMembers,
      };
      // Example: await api.createGroup(groupData);
      console.log("Group created:", groupData);
      setGroupName("");
      setSelectedMembers([]);
      setIsCreatingGroup(false);
    }
  };

  const toggleMemberSelection = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex justify-between mt-3 items-center gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-sm w-full"
          />
          <button
            onClick={() => setIsCreatingGroup(!isCreatingGroup)}
            className="flex items-center justify-center w-8 h-8 text-2xl font-bold text-500 text-grey rounded-full hover:bg- transition"
          >
            +
          </button>
        </div>
        {isCreatingGroup && (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="input input-sm w-full"
            />
            <div className="max-h-40 overflow-y-auto border border-base-300 rounded p-2">
              {filteredUsers.map((user) => (
                <label key={user._id} className="flex items-center gap-2 p-1">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => toggleMemberSelection(user._id)}
                    className="checkbox"
                  />
                  <span>{user.fullName} {onlineUsers.includes(user._id) ? "(Online)" : "(Offline)"}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleCreateGroup}
              className="btn btn-sm w-full mt-2"
            >
              Create Group
            </button>
            <button
              onClick={() => setIsCreatingGroup(false)}
              className="btn btn-sm w-full mt-1"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
