import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Avatar,
  Spinner,
  Input,
} from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getAllUsers } from "../../services/userApi";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleLabel = (roleId) => {
    const roleMap = {
      1: "Admin",
      2: "Người Bán",
      3: "Người Mua",
    };
    return roleMap[roleId] || "Không rõ";
  };

  const getRoleColor = (roleId) => {
    const colorMap = {
      1: "danger",
      2: "warning",
      3: "primary",
    };
    return colorMap[roleId] || "default";
  };

  const getStatusChip = (isVerified) => {
    return isVerified ? (
      <Chip color="success" variant="flat" size="sm">
        Đã xác thực
      </Chip>
    ) : (
      <Chip color="warning" variant="flat" size="sm">
        Chưa xác thực
      </Chip>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.roleId === parseInt(roleFilter);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && user.isVerified) ||
      (statusFilter === "unverified" && !user.isVerified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const totalSellers = users.filter((u) => u.roleId === 2).length;
  const totalBuyers = users.filter((u) => u.roleId === 3).length;
  const verifiedUsers = users.filter((u) => u.isVerified).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý tất cả người dùng trong hệ thống
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Người bán</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalSellers}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Người mua</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalBuyers}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã xác thực</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {verifiedUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Tìm kiếm theo tên, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            }
            variant="bordered"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="1">Admin</option>
            <option value="2">Người Bán</option>
            <option value="3">Người Mua</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="verified">Đã xác thực</option>
            <option value="unverified">Chưa xác thực</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <Table aria-label="Users table" className="min-h-[400px]">
            <TableHeader>
              <TableColumn>NGƯỜI DÙNG</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>SĐT</TableColumn>
              <TableColumn>VAI TRÒ</TableColumn>
              <TableColumn>TRẠNG THÁI</TableColumn>
              <TableColumn>NGÀY ĐĂNG KÝ</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Không tìm thấy người dùng nào">
              {filteredUsers.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.profilePicture}
                        name={user.fullName || user.username}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.fullName || user.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">
                      {user.phoneNumber || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getRoleColor(user.roleId)}
                      variant="flat"
                      size="sm"
                    >
                      {getRoleLabel(user.roleId)}
                    </Chip>
                  </TableCell>
                  <TableCell>{getStatusChip(user.isVerified)}</TableCell>
                  <TableCell>
                    <span className="text-gray-700">
                      {formatDate(user.registrationDate)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
