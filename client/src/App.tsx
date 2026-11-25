
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  FileText,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ShieldCheck,
  KeyRound,
  Menu,
  X,
  MoreHorizontal,
  LogOut,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
  Link,
  Outlet,
} from "react-router-dom";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Payments from "./pages/Payments";
import ApiKeys from "./pages/ApiKeys";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import Loading from "./components/Loading";
import Table from "./components/Table";

const navItems = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", path: "/dashboard/customers", icon: Users },
  { name: "Plans & Pricing", path: "/dashboard/plans", icon: CreditCard },
  { name: "Subscriptions", path: "/dashboard/subscriptions", icon: Receipt },
  { name: "Invoices", path: "/dashboard/invoices", icon: FileText },
  { name: "Payments", path: "/dashboard/payments", icon: Wallet },
];
const managementItems = [
  { name: "Ledger & Security", path: "/dashboard/security", icon: ShieldCheck },
  { name: "Team Members", path: "/dashboard/team", icon: Users },
  { name: "API Keys", path: "/dashboard/api-keys", icon: KeyRound },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];


function DashboardLayout() {
  const location = useLocation();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsRead, setNotificationsRead] = useState(false);

  const currentItem = [...navItems, ...managementItems].find(
    (item) => item.path === location.pathname
  );

  const currentPage = currentItem?.name || "Overview";

  const searchableItems = [...navItems, ...managementItems];

  const filteredItems = searchableItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("ledgerguard_token");
    window.location.href = "/login";
  };

  const renderNavigation = (items: typeof navItems) =>
    items.map((item) => {
      const Icon = item.icon;

      return (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/dashboard"}
          onClick={() => setMobileMenu(false)}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition ${
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-500 hover:bg-slate-50"
            }`
          }
        >
          <Icon size={19} />
          {item.name}
        </NavLink>
      );
    });

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800 md:flex">

      {/* SIDEBAR */}

      <aside className="hidden md:flex w-64 min-h-screen bg-white border-r border-slate-200 flex-col fixed left-0 top-0 z-20">

        <div className="px-7 py-7 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h1 className="font-bold text-xl tracking-tight">
              LedgerGuard
            </h1>
            <p className="text-xs text-slate-400">
              Billing Platform
            </p>
          </div>
        </div>

        <div className="px-5 mt-5">

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Workspace
          </p>

          {renderNavigation(navItems)}

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-9 mb-4">
            Management
          </p>

          {renderNavigation(managementItems)}

        </div>

        <div className="mt-auto p-5">

          <div className="bg-indigo-50 rounded-2xl p-4">

            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
              <ShieldCheck size={17} />
              Secure Workspace
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-5">
              Tenant isolation implementation and verification pending.
            </p>

          </div>

          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">

            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              AC
            </div>

            <div>
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-slate-400">
                admin@acme.com
              </p>
            </div>

          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="flex-1 md:ml-64 min-w-0">

        {/* HEADER */}

        <header className="h-20 bg-white border-b border-slate-200 px-5 md:px-9 flex items-center justify-between sticky top-0 z-30">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 text-slate-500"
              aria-label="Toggle navigation"
            >
              {mobileMenu ? <X /> : <Menu />}
            </button>

            <div>
              <h2 className="text-lg font-bold">
                {currentPage}
              </h2>

              <p className="text-xs text-slate-400 hidden sm:block">
                Welcome back! Manage your billing workspace.
              </p>
            </div>

          </div>

          {/* HEADER ACTIONS */}

          <div className="flex items-center gap-3">

            {/* SEARCH */}

            <div className="relative">

              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setNotificationOpen(false);
                  setProfileOpen(false);
                }}
                className="hidden sm:flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition"
              >
                <Search size={16} />
                Search
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-14 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50">

                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-sm">
                      Search Pages
                    </h3>

                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customers, invoices..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <p className="text-xs font-semibold text-slate-400 mt-4 mb-2">
                    SEARCH RESULTS
                  </p>

                  <div className="max-h-52 overflow-y-auto">

                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          {item.name}
                        </NavLink>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 p-2">
                        No matching pages found.
                      </p>
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* NOTIFICATIONS */}

            <div className="relative">

              <button
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setSearchOpen(false);
                  setProfileOpen(false);
                }}
                className="relative p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition"
                aria-label="Notifications"
              >
                <Bell size={19} />

                {!notificationsRead && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                )}

              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-14 w-80 max-w-[85vw] bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50">

                  <div className="flex justify-between items-center mb-4">

                    <h3 className="font-bold text-slate-800">
                      Notifications
                    </h3>

                    <button
                      onClick={() => setNotificationsRead(true)}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Mark all read
                    </button>

                  </div>

                  <div className="space-y-3">

                    <div className={`p-3 rounded-lg ${notificationsRead ? "bg-white" : "bg-indigo-50"}`}>
                      <p className="text-sm font-semibold text-slate-700">
                        Welcome to LedgerGuard
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Your billing dashboard is ready.
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg ${notificationsRead ? "bg-white" : "bg-indigo-50"}`}>
                      <p className="text-sm font-semibold text-slate-700">
                        Security verification
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Backend security verification is pending.
                      </p>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* PROFILE */}

            <div className="relative">

              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setSearchOpen(false);
                  setNotificationOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm hover:bg-indigo-200 transition"
                aria-label="User profile"
              >
                AC
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50">

                  <div className="px-3 py-2 border-b border-slate-100 mb-2">

                    <p className="font-semibold text-sm text-slate-800">
                      Admin User
                    </p>

                    <p className="text-xs text-slate-400">
                      admin@acme.com
                    </p>

                  </div>

                  <NavLink
                    to="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Settings size={16} className="inline mr-2" />
                    Settings
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="inline mr-2" />
                    Logout
                  </button>

                </div>
              )}

            </div>

          </div>

        </header>

        {/* MOBILE NAVIGATION */}

        {mobileMenu && (
          <div className="md:hidden bg-white border-b border-slate-200 p-5">

            <p className="text-xs font-semibold text-slate-400 uppercase mb-3">
              Workspace
            </p>

            {renderNavigation(navItems)}

            <p className="text-xs font-semibold text-slate-400 uppercase mt-6 mb-3">
              Management
            </p>

            {renderNavigation(managementItems)}

          </div>
        )}

        {/* PAGE CONTENT */}

        <Outlet />

      </main>

    </div>
  );
}



function Overview() {
  const [period, setPeriod] = useState("7");
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  type DashboardInvoice = {
    id: string;
    customer: string;
    date: string;
    amount: string;
    status: string;
  };

  const [recentInvoices, setRecentInvoices] = useState<DashboardInvoice[]>([]);

  // Load invoices from shared localStorage
  useEffect(() => {
    const loadInvoices = () => {
      try {
        const saved = localStorage.getItem("ledgerguard_invoices");

        if (!saved) {
          setRecentInvoices([]);
          return;
        }

        const invoices = JSON.parse(saved);

        if (!Array.isArray(invoices)) {
          setRecentInvoices([]);
          return;
        }

        const formatted = [...invoices]
          .sort(
            (a: any, b: any) =>
              new Date(b.issueDate).getTime() -
              new Date(a.issueDate).getTime()
          )
          .slice(0, 4)
          .map((invoice: any) => ({
            id: invoice.invoiceNo,
            customer: invoice.customer,
            date: new Date(invoice.issueDate).toLocaleDateString("en-IN"),
            amount: `₹${Number(invoice.amount).toLocaleString("en-IN")}`,
            status: invoice.status,
          }));

        setRecentInvoices(formatted);
      } catch (error) {
        console.error("Dashboard invoice error:", error);
        setRecentInvoices([]);
      }
    };

    loadInvoices();

    window.addEventListener(
      "ledgerguard-invoices-updated",
      loadInvoices
    );

    return () => {
      window.removeEventListener(
        "ledgerguard-invoices-updated",
        loadInvoices
      );
    };
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      value: "$48,290",
      change: "+12.8%",
      icon: Wallet,
      path: "/dashboard/payments",
    },
    {
      title: "Active Subscriptions",
      value: "1,284",
      change: "+8.2%",
      icon: CreditCard,
      path: "/dashboard/subscriptions",
    },
    {
      title: "Total Customers",
      value: "856",
      change: "+5.4%",
      icon: Users,
      path: "/dashboard/customers",
    },
    {
      title: "Pending Invoices",
      value: String(
        recentInvoices.filter((invoice) => invoice.status === "Pending").length
      ),
      change: "-2.1%",
      icon: Receipt,
      path: "/dashboard/invoices",
    },
  ];

  const revenueData =
    period === "7"
      ? [
          { label: "May", revenue: 4500 },
          { label: "Jun", revenue: 6500 },
          { label: "Jul", revenue: 5000 },
          { label: "Aug", revenue: 8000 },
          { label: "Sep", revenue: 6000 },
          { label: "Oct", revenue: 9000 },
          { label: "Nov", revenue: 7290 },
        ]
      : [
          { label: "Week 1", revenue: 3500 },
          { label: "Week 2", revenue: 6500 },
          { label: "Week 3", revenue: 5000 },
          { label: "Week 4", revenue: 9000 },
        ];

  const subscriptionData = [
    { name: "Starter", active: 420 },
    { name: "Professional", active: 580 },
    { name: "Enterprise", active: 284 },
  ];

  const overdueData = [
    {
      name: "Overdue",
      value: recentInvoices.filter((invoice) => invoice.status === "Overdue").length,
    },
    {
      name: "Paid",
      value: recentInvoices.filter((invoice) => invoice.status === "Paid").length,
    },
    {
      name: "Pending",
      value: recentInvoices.filter((invoice) => invoice.status === "Pending").length,
    },
  ];

  const pieColors = ["#EF4444", "#10B981", "#F59E0B"];

  return (
    <div className="p-5 md:p-9 max-w-[1500px] mx-auto">

      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">
            Track your business performance and revenue.
          </p>
        </div>

        <Link
          to="/dashboard/invoices"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-3 text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create Invoice
        </Link>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((card) => {
          const Icon = card.icon;
          const isNegative = card.change.startsWith("-");
          const TrendIcon = isNegative ? ArrowDownRight : ArrowUpRight;
          const trendColor = isNegative
            ? "text-red-500"
            : "text-emerald-600";

          return (
            <Link
              to={card.path}
              key={card.title}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{card.title}</p>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon size={20} />
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-5">{card.value}</h3>

              <div className="flex items-center gap-1 mt-2 text-xs">
                <TrendIcon size={15} className={trendColor} />
                <span className={`${trendColor} font-semibold`}>
                  {card.change}
                </span>
                <span className="text-slate-400">vs last month</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Revenue Area Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-7">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-lg">Monthly Revenue</h3>
            <p className="text-xs text-slate-400 mt-1">
              Revenue performance overview
            </p>
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
          >
            <option value="7">Last 7 months</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366F1"
                strokeWidth={3}
                fill="url(#revenueColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subscription and Invoice Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-7">

        {/* Active Subscriptions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg">Active Subscriptions</h3>
          <p className="text-xs text-slate-400 mt-1">
            Plan-wise subscription distribution
          </p>

          <div className="h-72 mt-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="active"
                  name="Active Subscriptions"
                  fill="#6366F1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg">Invoice Overview</h3>
          <p className="text-xs text-slate-400 mt-1">
            Paid, pending and overdue invoice distribution
          </p>

          <div className="h-72 mt-5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overdueData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {overdueData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <Link
        to="/dashboard/security"
        className="bg-indigo-600 rounded-2xl p-6 text-white shadow-sm block hover:bg-indigo-700 transition mt-7"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Security Status</h3>
          <ShieldCheck size={23} />
        </div>

        <div className="mt-9">
          <p className="text-indigo-200 text-sm">
            Workspace protection
          </p>
          <h2 className="text-3xl font-bold mt-2">Preview</h2>
          <p className="text-xs text-indigo-200 mt-2">
            Backend security verification pending.
          </p>
        </div>

        <div className="mt-8 pt-5 border-t border-indigo-400/40 flex justify-between text-sm">
          <span>Tenant isolation</span>
          <span className="font-semibold">UI Preview</span>
        </div>
      </Link>

      {/* Recent Invoices */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg">Recent Invoices</h3>
            <p className="text-xs text-slate-400 mt-1">
              Latest billing transactions
            </p>
          </div>

          <Link
            to="/dashboard/invoices"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-100">
                <th className="pb-4">Invoice</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-slate-50 text-sm"
                  >
                    <td className="py-4 font-semibold text-indigo-600">
                      {invoice.id}
                    </td>

                    <td className="py-4 font-medium">
                      {invoice.customer}
                    </td>

                    <td className="py-4 text-slate-500">
                      {invoice.date}
                    </td>

                    <td className="py-4 font-semibold">
                      {invoice.amount}
                    </td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === "Paid"
                            ? "bg-emerald-50 text-emerald-600"
                            : invoice.status === "Pending"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="py-4">
                      <button
                        onClick={() =>
                          setSelectedInvoice(
                            selectedInvoice === invoice.id
                              ? null
                              : invoice.id
                          )
                        }
                        className="text-slate-400 hover:text-indigo-600"
                        title="Invoice details"
                      >
                        <MoreHorizontal size={19} />
                      </button>

                      {selectedInvoice === invoice.id && (
                        <button
                          onClick={() =>
                            window.alert(
                              `Invoice: ${invoice.id}\nCustomer: ${invoice.customer}\nAmount: ${invoice.amount}\nStatus: ${invoice.status}`
                            )
                          }
                          className="ml-2 text-indigo-600 text-xs font-semibold"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-slate-400"
                  >
                    No invoices found. Create your first invoice.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



function Customers() {
  type Customer = {
    id: number;
    name: string;
    email: string;
    company: string;
    status: "Active" | "Inactive";
  };

  const STORAGE_KEY = "ledgerguard_customers";

  const defaultCustomers: Customer[] = [
    { id: 1, name: "John Smith", email: "john@acme.com", company: "Acme Corporation", status: "Active" },
    { id: 2, name: "Sarah Wilson", email: "sarah@vertex.com", company: "Vertex Solutions", status: "Active" },
    { id: 3, name: "Michael Brown", email: "michael@nova.com", company: "Nova Technologies", status: "Active" },
    { id: 4, name: "Emily Davis", email: "emily@bright.com", company: "Bright Labs", status: "Inactive" },
  ];

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) as Customer[] : defaultCustomers;
    } catch {
      return defaultCustomers;
    }
  });

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  // Update state and browser storage together
  const saveCustomers = (updatedCustomers: Customer[]) => {
    setCustomers(updatedCustomers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCustomers));
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setCompany("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingId !== null) {
      const updated = customers.map((customer) =>
        customer.id === editingId
          ? { ...customer, name, email, company }
          : customer
      );

      saveCustomers(updated);
    } else {
      const newCustomer: Customer = {
        id: Date.now(),
        name,
        email,
        company,
        status: "Active",
      };

      saveCustomers([...customers, newCustomer]);
    }

    resetForm();
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setName(customer.name);
    setEmail(customer.email);
    setCompany(customer.company);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      saveCustomers(customers.filter((customer) => customer.id !== id));
    }
  };

  // Toggle customer status
  const toggleStatus = (id: number) => {
    const updated = customers.map((customer) =>
      customer.id === id
        ? {
            ...customer,
            status: customer.status === "Active" ? "Inactive" : "Active",
          } as Customer
        : customer
    );

    saveCustomers(updated);
  };

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.company}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-5 md:p-9 max-w-[1500px] mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Customers</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage and organize your business customers.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total Customers</p>
          <h3 className="text-3xl font-bold mt-3">{customers.length}</h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Active Customers</p>
          <h3 className="text-3xl font-bold mt-3">
            {customers.filter((c) => c.status === "Active").length}
          </h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Inactive Customers</p>
          <h3 className="text-3xl font-bold mt-3">
            {customers.filter((c) => c.status === "Inactive").length}
          </h3>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-lg">All Customers</h3>
            <p className="text-xs text-slate-400 mt-1">
              View and manage your customers.
            </p>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400">
                <th className="pb-4">Customer</th>
                <th className="pb-4">Company</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-50 text-sm">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold">{customer.name}</span>
                    </div>
                  </td>

                  <td className="py-5">{customer.company}</td>
                  <td className="py-5 text-slate-500">{customer.email}</td>

                  <td className="py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      customer.status === "Active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {customer.status}
                    </span>
                  </td>

                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleStatus(customer.id)}
                        className={`font-semibold hover:underline ${
                          customer.status === "Active"
                            ? "text-amber-600 hover:text-amber-800"
                            : "text-emerald-600 hover:text-emerald-800"
                        }`}
                      >
                        {customer.status === "Active" ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-indigo-600 font-semibold hover:text-indigo-800"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-500 font-semibold hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingId !== null ? "Edit Customer" : "Add New Customer"}
              </h3>

              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-red-500"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Customer Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@company.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Company Name
                </label>
                <input
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-slate-200 rounded-xl py-3 font-semibold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold"
                >
                  {editingId !== null ? "Save Changes" : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


function Plans() {
  type Plan = {
    id: number;
    name: string;
    monthly: number;
    yearly: number;
    features: string;
    status: "Active" | "Inactive";
  };

  const STORAGE_KEY = "ledgerguard_plans";

  const defaultPlans: Plan[] = [
    {
      id: 1,
      name: "Starter",
      monthly: 19,
      yearly: 190,
      features: "Basic billing, 5 team members",
      status: "Active",
    },
    {
      id: 2,
      name: "Professional",
      monthly: 49,
      yearly: 490,
      features: "Advanced analytics, 20 team members",
      status: "Active",
    },
    {
      id: 3,
      name: "Enterprise",
      monthly: 99,
      yearly: 990,
      features: "Unlimited members, Priority support",
      status: "Active",
    },
  ];

  const [plans, setPlans] = useState<Plan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) as Plan[] : defaultPlans;
    } catch {
      return defaultPlans;
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [monthly, setMonthly] = useState("");
  const [yearly, setYearly] = useState("");
  const [features, setFeatures] = useState("");

  // Save plans in state and localStorage
  const savePlans = (updatedPlans: Plan[]) => {
    setPlans(updatedPlans);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
  };

  const resetForm = () => {
    setName("");
    setMonthly("");
    setYearly("");
    setFeatures("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const monthlyPrice = Number(monthly);
    const yearlyPrice = Number(yearly);

    if (
      !name.trim() ||
      !Number.isFinite(monthlyPrice) ||
      !Number.isFinite(yearlyPrice) ||
      monthlyPrice < 0 ||
      yearlyPrice < 0
    ) {
      return;
    }

    if (editingId !== null) {
      const updated = plans.map((plan) =>
        plan.id === editingId
          ? {
              ...plan,
              name: name.trim(),
              monthly: monthlyPrice,
              yearly: yearlyPrice,
              features,
            }
          : plan
      );

      savePlans(updated);
    } else {
      const newPlan: Plan = {
        id: Date.now(),
        name: name.trim(),
        monthly: monthlyPrice,
        yearly: yearlyPrice,
        features,
        status: "Active",
      };

      savePlans([...plans, newPlan]);
    }

    resetForm();
  };

  const handleEdit = (plan: Plan) => {
    setEditingId(plan.id);
    setName(plan.name);
    setMonthly(String(plan.monthly));
    setYearly(String(plan.yearly));
    setFeatures(plan.features);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      savePlans(plans.filter((plan) => plan.id !== id));
    }
  };

  // Activate / Deactivate plan
  const toggleStatus = (id: number) => {
    const updated = plans.map((plan) =>
      plan.id === id
        ? {
            ...plan,
            status: plan.status === "Active" ? "Inactive" as const : "Active" as const,
          }
        : plan
    );

    savePlans(updated);
  };

  return (
    <div className="p-5 md:p-9 max-w-[1500px] mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Plans & Pricing</h2>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage your subscription pricing plans.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total Plans</p>
          <h3 className="text-3xl font-bold mt-3">{plans.length}</h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Active Plans</p>
          <h3 className="text-3xl font-bold mt-3">
            {plans.filter((p) => p.status === "Active").length}
          </h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Inactive Plans</p>
          <h3 className="text-3xl font-bold mt-3">
            {plans.filter((p) => p.status === "Inactive").length}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-indigo-600">
                SUBSCRIPTION PLAN
              </span>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                plan.status === "Active"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}>
                {plan.status}
              </span>
            </div>

            <h3 className="text-2xl font-bold mt-6">{plan.name}</h3>

            <div className="mt-5">
              <p className="text-sm text-slate-500">Monthly Price</p>
              <h2 className="text-3xl font-bold mt-1">
                ${plan.monthly}
                <span className="text-sm text-slate-400 font-normal">
                  /month
                </span>
              </h2>
            </div>

            <div className="mt-5 p-4 bg-indigo-50 rounded-xl">
              <p className="text-sm text-indigo-700">Yearly Price</p>
              <h3 className="text-xl font-bold text-indigo-800 mt-1">
                ${plan.yearly}/year
              </h3>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700">
                Plan Features
              </p>
              <p className="text-sm text-slate-500 mt-2 leading-6">
                {plan.features || "No features added yet."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-7 pt-5 border-t border-slate-100">
              <button
                onClick={() => handleEdit(plan)}
                className="py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100"
              >
                Edit
              </button>

              <button
                onClick={() => toggleStatus(plan.id)}
                className={`py-2 rounded-lg text-sm font-semibold ${
                  plan.status === "Active"
                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {plan.status === "Active" ? "Disable" : "Enable"}
              </button>

              <button
                onClick={() => handleDelete(plan.id)}
                className="py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 mt-6">
          <CreditCard size={40} className="mx-auto text-slate-300" />
          <h3 className="font-bold text-lg mt-4">No Plans Available</h3>
          <p className="text-sm text-slate-500 mt-2">
            Create your first subscription plan.
          </p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl">

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingId !== null ? "Edit Plan" : "Create New Plan"}
              </h3>

              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-red-500"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Plan Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Plan"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Monthly Price ($)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={monthly}
                    onChange={(e) => setMonthly(e.target.value)}
                    placeholder="49"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Yearly Price ($)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={yearly}
                    onChange={(e) => setYearly(e.target.value)}
                    placeholder="490"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Plan Features
                </label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Enter plan features..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-slate-200 rounded-xl py-3 font-semibold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold"
                >
                  {editingId !== null ? "Save Changes" : "Create Plan"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}



function Subscriptions() {
  type Subscription = {
    id: number;
    customer: string;
    plan: string;
    billing: string;
    amount: number;
    status: "Active" | "Cancelled";
    date: string;
  };

  const STORAGE_KEY = "ledgerguard_subscriptions";

  const defaultSubscriptions: Subscription[] = [
    { id: 1, customer: "John Smith", plan: "Professional", billing: "Monthly", amount: 49, status: "Active", date: "Nov 01, 2026" },
    { id: 2, customer: "Sarah Wilson", plan: "Enterprise", billing: "Yearly", amount: 990, status: "Active", date: "Nov 02, 2026" },
    { id: 3, customer: "Michael Brown", plan: "Starter", billing: "Monthly", amount: 19, status: "Active", date: "Nov 03, 2026" },
    { id: 4, customer: "Emily Davis", plan: "Professional", billing: "Yearly", amount: 490, status: "Cancelled", date: "Nov 04, 2026" },
  ];

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) as Subscription[] : defaultSubscriptions;
    } catch {
      return defaultSubscriptions;
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [customer, setCustomer] = useState("");
  const [plan, setPlan] = useState("");
  const [billing, setBilling] = useState("Monthly");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");

  // Save subscriptions in state and localStorage
  const saveSubscriptions = (updated: Subscription[]) => {
    setSubscriptions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const resetForm = () => {
    setCustomer("");
    setPlan("");
    setBilling("Monthly");
    setAmount("");
    setEditingId(null);
    setShowForm(false);
  };

  // Add and Edit subscription
  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const price = Number(amount);

    if (
      !customer.trim() ||
      !plan.trim() ||
      amount.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return;
    }

    if (editingId !== null) {
      const updated = subscriptions.map((s) =>
        s.id === editingId
          ? {
              ...s,
              customer: customer.trim(),
              plan: plan.trim(),
              billing,
              amount: price,
            }
          : s
      );

      saveSubscriptions(updated);
    } else {
      const newSubscription: Subscription = {
        id: Date.now(),
        customer: customer.trim(),
        plan: plan.trim(),
        billing,
        amount: price,
        status: "Active",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      saveSubscriptions([newSubscription, ...subscriptions]);
    }

    resetForm();
  };

  // Edit subscription
  const handleEdit = (s: Subscription) => {
    setEditingId(s.id);
    setCustomer(s.customer);
    setPlan(s.plan);
    setBilling(s.billing);
    setAmount(String(s.amount));
    setShowForm(true);
  };

  // Delete subscription
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      saveSubscriptions(
        subscriptions.filter((s) => s.id !== id)
      );
    }
  };

  // Active / Cancelled toggle
  const toggleStatus = (id: number) => {
    const updated = subscriptions.map((s) =>
      s.id === id
        ? {
            ...s,
            status: s.status === "Active" ? "Cancelled" as const : "Active" as const,
          }
        : s
    );

    saveSubscriptions(updated);
  };

  const filteredSubscriptions = subscriptions.filter((s) =>
    `${s.customer} ${s.plan} ${s.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-5 md:p-9 max-w-[1500px] mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Subscriptions</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage customer subscriptions and billing cycles.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create Subscription
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total Subscriptions</p>
          <h3 className="text-3xl font-bold mt-3">
            {subscriptions.length}
          </h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Active Subscriptions</p>
          <h3 className="text-3xl font-bold mt-3">
            {subscriptions.filter((s) => s.status === "Active").length}
          </h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Cancelled Subscriptions</p>
          <h3 className="text-3xl font-bold mt-3">
            {subscriptions.filter((s) => s.status === "Cancelled").length}
          </h3>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-lg">All Subscriptions</h3>
            <p className="text-xs text-slate-400 mt-1">
              Monitor your customer billing activity.
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriptions..."
            className="w-full sm:w-72 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400">
                <th className="pb-4">Customer</th>
                <th className="pb-4">Plan</th>
                <th className="pb-4">Billing Cycle</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubscriptions.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 text-sm">
                  <td className="py-5 font-semibold">{s.customer}</td>

                  <td className="py-5">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-semibold">
                      {s.plan}
                    </span>
                  </td>

                  <td className="py-5 text-slate-500">{s.billing}</td>

                  <td className="py-5 font-bold">${s.amount}</td>

                  <td className="py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.status === "Active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}>
                      {s.status}
                    </span>
                  </td>

                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-indigo-600 font-semibold hover:text-indigo-800"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => toggleStatus(s.id)}
                        className={`font-semibold ${
                          s.status === "Active"
                            ? "text-amber-600 hover:text-amber-800"
                            : "text-emerald-600 hover:text-emerald-800"
                        }`}
                      >
                        {s.status === "Active" ? "Cancel" : "Activate"}
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-500 font-semibold hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSubscriptions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl my-auto">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingId !== null ? "Edit Subscription" : "Create Subscription"}
              </h3>

              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 hover:text-red-500"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Customer Name
                </label>

                <input
                  required
                  type="text"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Plan Name
                </label>

                <input
                  required
                  type="text"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  placeholder="Enter your plan name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Billing Cycle
                </label>

                <select
                  value={billing}
                  onChange={(e) => setBilling(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Subscription Amount ($)
                </label>

                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl">
                <p className="text-sm text-indigo-600">
                  Subscription Amount
                </p>
                <h3 className="text-2xl font-bold text-indigo-800 mt-1">
                  ${amount === "" ? "0" : amount}
                  <span className="text-sm font-normal">
                    /{billing === "Monthly" ? "month" : "year"}
                  </span>
                </h3>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-slate-200 rounded-xl py-3 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold"
                >
                  {editingId !== null ? "Save Changes" : "Create"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
const toLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDefaultInvoiceDates = () => {
  const issue = new Date();
  const due = new Date();

  due.setDate(due.getDate() + 14);

  return {
    issueDate: toLocalDateString(issue),
    dueDate: toLocalDateString(due),
  };
};

function Invoices() {
  type Invoice = {
    id: number;
    invoiceNo: string;
    customer: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    status: "Paid" | "Pending";
  };

  const defaultCustomers = [
    "Acme Corporation",
    "Tech Solutions",
    "Global Services",
    "Digital Agency",
  ];

  const [customers, setCustomers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("ledgerguard_invoice_customers");
      return saved ? JSON.parse(saved) : defaultCustomers;
    } catch {
      return defaultCustomers;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem("ledgerguard_invoices");
      if (saved) return JSON.parse(saved) as Invoice[];
    } catch (error) {
      console.error("Error loading invoices:", error);
    }

    return [
      {
        id: 1,
        invoiceNo: "INV-1001",
        customer: "Acme Corporation",
        amount: 25000,
        issueDate: "2026-11-01",
        dueDate: "2026-11-15",
        status: "Paid",
      },
      {
        id: 2,
        invoiceNo: "INV-1002",
        customer: "Tech Solutions",
        amount: 18000,
        issueDate: "2026-11-02",
        dueDate: "2026-11-10",
        status: "Pending",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(
      "ledgerguard_invoices",
      JSON.stringify(invoices)
    );

    window.dispatchEvent(
      new Event("ledgerguard-invoices-updated")
    );
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(
      "ledgerguard_invoice_customers",
      JSON.stringify(customers)
    );
  }, [customers]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [issueDate, setIssueDate] = useState(
    () => getDefaultInvoiceDates().issueDate
  );
  const [dueDate, setDueDate] = useState(
    () => getDefaultInvoiceDates().dueDate
  );
  const [status, setStatus] = useState<"Paid" | "Pending">("Pending");

  const getInvoiceStatus = (invoice: Invoice) => {
    if (invoice.status === "Paid") return "Paid";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(invoice.dueDate + "T00:00:00");

    return due < today ? "Overdue" : "Pending";
  };

  const resetForm = () => {
    setCustomer("");
    setAmount("");
    setIssueDate(getDefaultInvoiceDates().issueDate);
    setDueDate(getDefaultInvoiceDates().dueDate);
    setStatus("Pending");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const companyName = customer.trim();

    if (
      !companyName ||
      Number(amount) <= 0 ||
      !dueDate ||
      !issueDate
    ) {
      alert("Please enter valid invoice details.");
      return;
    }

    if (dueDate < issueDate) {
      alert("Due date cannot be earlier than issue date.");
      return;
    }

    const existingCustomer = customers.some(
      (name) => name.toLowerCase() === companyName.toLowerCase()
    );

    if (!existingCustomer) {
      setCustomers((previous) => [...previous, companyName]);
    }

    if (editingId !== null) {
      setInvoices((previous) =>
        previous.map((invoice) =>
          invoice.id === editingId
            ? {
                ...invoice,
                customer: companyName,
                amount: Number(amount),
                issueDate,
                dueDate,
                status,
              }
            : invoice
        )
      );
    } else {
      const nextNumber =
        Math.max(
          1000,
          ...invoices.map((invoice) =>
            Number(invoice.invoiceNo.replace("INV-", ""))
          )
        ) + 1;

      const newInvoice: Invoice = {
        id: Date.now(),
        invoiceNo: `INV-${nextNumber}`,
        customer: companyName,
        amount: Number(amount),
        issueDate,
        dueDate,
        status,
      };

      setInvoices((previous) => [newInvoice, ...previous]);
    }

    resetForm();
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingId(invoice.id);
    setCustomer(invoice.customer);
    setAmount(String(invoice.amount));
    setIssueDate(invoice.issueDate);
    setDueDate(invoice.dueDate);
    setStatus(invoice.status);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      setInvoices((previous) =>
        previous.filter((invoice) => invoice.id !== id)
      );
    }
  };

  const handleToggleStatus = (id: number) => {
    setInvoices((previous) =>
      previous.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              status: invoice.status === "Paid" ? "Pending" : "Paid",
            }
          : invoice
      )
    );
  };

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow pop-ups to print the invoice.");
      return;
    }

    const safe = (value: string) =>
      value.replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
        return entities[character];
      });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${safe(invoice.invoiceNo)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 45px; color: #222; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; }
            h1 { color: #4f46e5; margin: 0; }
            .details { margin-top: 35px; line-height: 2; }
            table { width: 100%; border-collapse: collapse; margin-top: 35px; }
            th, td { padding: 15px; border: 1px solid #ddd; text-align: left; }
            th { background: #f3f4f6; }
            .total { text-align: right; margin-top: 25px; font-size: 22px; font-weight: bold; }
            .footer { margin-top: 60px; color: #777; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div><h1>LedgerGuard</h1><p>Professional Billing & Invoicing</p></div>
            <div><h2>INVOICE</h2><p>${safe(invoice.invoiceNo)}</p></div>
          </div>
          <div class="details">
            <strong>Bill To:</strong> ${safe(invoice.customer)}<br/>
            <strong>Issue Date:</strong> ${safe(invoice.issueDate)}<br/>
            <strong>Due Date:</strong> ${safe(invoice.dueDate)}<br/>
            <strong>Status:</strong> ${getInvoiceStatus(invoice)}
          </div>
          <table>
            <tr><th>Description</th><th>Amount</th></tr>
            <tr><td>Billing Services</td><td>₹${invoice.amount.toLocaleString("en-IN")}</td></tr>
          </table>
          <div class="total">Total: ₹${invoice.amount.toLocaleString("en-IN")}</div>
          <div class="footer">Thank you for your business!<br/>Generated by LedgerGuard</div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );

  const paidAmount = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const pendingCount = invoices.filter(
    (invoice) => getInvoiceStatus(invoice) === "Pending"
  ).length;

  const overdueCount = invoices.filter(
    (invoice) => getInvoiceStatus(invoice) === "Overdue"
  ).length;

  return (
    <div className="p-5 md:p-9 max-w-[1500px] mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, view and manage customer invoices.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          + Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Invoices</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{invoices.length}</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Amount</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            ₹{totalAmount.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Paid Amount</p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-600">
            ₹{paidAmount.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Pending / Overdue</p>
          <h2 className="mt-2 text-2xl font-bold text-amber-600">
            {pendingCount} / {overdueCount}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">All Invoices</h2>

          <input
            type="text"
            placeholder="Search invoice or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 sm:w-72"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => {
                const invoiceStatus = getInvoiceStatus(invoice);

                return (
                  <tr key={invoice.id} className="border-b border-slate-100 text-sm">
                    <td className="px-4 py-4 font-semibold text-indigo-600">
                      {invoice.invoiceNo}
                    </td>
                    <td className="px-4 py-4 text-slate-700">{invoice.customer}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      ₹{invoice.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{invoice.dueDate}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          invoiceStatus === "Paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : invoiceStatus === "Overdue"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {invoiceStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleToggleStatus(invoice.id)}
                          className="font-medium text-amber-600 hover:text-amber-800"
                        >
                          {invoice.status === "Paid" ? "Mark Pending" : "Mark Paid"}
                        </button>

                        <button
                          onClick={() => handlePrint(invoice)}
                          className="font-medium text-emerald-600 hover:text-emerald-800"
                        >
                          Print
                        </button>

                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="font-medium text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId !== null ? "Edit Invoice" : "Create Invoice"}
              </h2>

              <button
                onClick={resetForm}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Customer / Company Name
                </label>

                <input
                  type="text"
                  list="invoice-company-suggestions"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Type any company name..."
                  autoComplete="off"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />

                <datalist id="invoice-company-suggestions">
                  {customers.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>

                <p className="mt-1 text-xs text-slate-400">
                  Select an existing company or type a new company name.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Invoice Amount (₹)
                </label>

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Issue Date
                  </label>

                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={dueDate}
                    min={issueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Payment Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "Paid" | "Pending")
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  {editingId !== null ? "Update Invoice" : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



function Security() {
  type LedgerEntry = {
    id: number;
    data: string;
    createdAt: string;
    prevHash: string;
    hash: string;
  };

  const [entries, setEntries] = useState<LedgerEntry[]>(() => {
    try {
      const saved = localStorage.getItem("ledgerguard_ledger");
      if (!saved) return [];
      const parsed: unknown = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed as LedgerEntry[] : [];
    } catch {
      return [];
    }
  });

  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [verification, setVerification] = useState<
    "Unknown" | "Verified" | "Tampered"
  >("Unknown");

  const saveEntries = (updated: LedgerEntry[]) => {
    try {
      localStorage.setItem(
        "ledgerguard_ledger",
        JSON.stringify(updated)
      );
      setEntries(updated);
      setVerification("Unknown");
    } catch {
      setResult("Unable to save ledger data in browser storage.");
    }
  };

  const generateHash = async (value: string) => {
    if (!window.crypto?.subtle) {
      throw new Error("Secure browser crypto is unavailable. Use HTTPS or localhost.");
    }

    const encoded = new TextEncoder().encode(value);
    const buffer = await window.crypto.subtle.digest("SHA-256", encoded);

    return Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleAddEntry = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!description.trim()) {
      setResult("Please enter a transaction description.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const createdAt = new Date().toISOString();
      const prevHash =
        entries.length > 0
          ? entries[entries.length - 1].hash
          : "GENESIS";

      const data = description.trim();
      const hash = await generateHash(
        `${data}|${createdAt}|${prevHash}`
      );

      const newEntry: LedgerEntry = {
        id: Date.now(),
        data,
        createdAt,
        prevHash,
        hash,
      };

      try {
        localStorage.setItem(
          "ledgerguard_ledger",
          JSON.stringify([...entries, newEntry])
        );
      } catch {
        throw new Error("Unable to save ledger entry.");
      }

      setEntries((previous) => [...previous, newEntry]);
      setDescription("");
      setVerification("Unknown");
      setResult("SUCCESS: Ledger entry added successfully.");
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : "Hash generation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyLedger = async () => {
    setLoading(true);
    setResult("");

    try {
      if (entries.length === 0) {
        setVerification("Unknown");
        setResult("No ledger entries available to verify.");
        return;
      }

      let previousHash = "GENESIS";

      for (const entry of entries) {
        if (entry.prevHash !== previousHash) {
          setVerification("Tampered");
          setResult(`FAILED: Chain broken at entry ${entry.id}`);
          return;
        }

        const expectedHash = await generateHash(
          `${entry.data}|${entry.createdAt}|${entry.prevHash}`
        );

        if (expectedHash !== entry.hash) {
          setVerification("Tampered");
          setResult(
            `FAILED: Data tampering detected at entry ${entry.id}`
          );
          return;
        }

        previousHash = entry.hash;
      }

      setVerification("Verified");
      setResult("SUCCESS: All ledger entries are valid. No tampering detected.");
    } catch (error) {
      setVerification("Unknown");
      setResult(
        error instanceof Error ? error.message : "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const tamperDemo = () => {
    if (entries.length === 0) {
      setResult("Add at least one entry before testing tampering.");
      return;
    }

    const updated = entries.map((entry, index) =>
      index === 0
        ? { ...entry, data: entry.data + " [MODIFIED]" }
        : entry
    );

    saveEntries(updated);
    setVerification("Tampered");
    setResult("Demo: First entry modified. Click Verify Ledger to confirm.");
  };

  const resetDemo = () => {
    if (window.confirm("Clear all demo ledger entries?")) {
      saveEntries([]);
      setResult("Demo ledger cleared.");
      setVerification("Unknown");
    }
  };

  const copyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setResult("Hash copied to clipboard successfully.");
    } catch {
      setResult("Unable to copy hash. Please copy it manually.");
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = [
      entry.id,
      entry.data,
      entry.prevHash,
      entry.hash,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Verified" && verification === "Verified") ||
      (filter === "Tampered" && verification === "Tampered");

    return matchesSearch && matchesFilter;
  });

  const isFailed = result.startsWith("FAILED");

  const statusColor =
    verification === "Verified"
      ? "text-emerald-600"
      : verification === "Tampered"
        ? "text-red-600"
        : "text-amber-600";

  return (
    <div className="p-5 md:p-9 max-w-[1500px] mx-auto">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Ledger & Security
          </h2>
          <p className="text-slate-500 mt-2">
            Monitor ledger records and verify data integrity.
          </p>
        </div>

        <button
          onClick={verifyLedger}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Checking..." : "✓ Verify Ledger"}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-slate-500">Total Entries</p>
          <h3 className="text-3xl font-bold mt-2">
            {entries.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-slate-500">Hash Algorithm</p>
          <h3 className="text-2xl font-bold mt-2">SHA-256</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-slate-500">Chain Status</p>
          <h3 className={`text-xl font-bold mt-2 ${statusColor}`}>
            {verification}
          </h3>
        </div>

      </div>

      {/* Add Entry */}
      <div className="bg-white rounded-2xl border p-6 mb-7 shadow-sm">
        <h3 className="text-lg font-bold mb-5">
          Add Ledger Entry
        </h3>

        <form
          onSubmit={handleAddEntry}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter ledger transaction description..."
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Adding..." : "+ Add Entry"}
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-xl mb-7 font-medium break-words ${
          isFailed
            ? "bg-red-50 text-red-700"
            : result.startsWith("SUCCESS")
              ? "bg-green-50 text-green-700"
              : "bg-indigo-50 text-indigo-700"
        }`}>
          {result}
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border p-5 md:p-6 shadow-sm">

        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold">Ledger Entries</h3>

          <div className="flex flex-wrap gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ledger..."
              className="border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2"
            >
              <option value="All">All Entries</option>
              <option value="Verified">Verified</option>
              <option value="Tampered">Tampered</option>
            </select>

            <button
              onClick={tamperDemo}
              disabled={entries.length === 0 || loading}
              className="border border-red-300 text-red-600 px-4 py-2 rounded-xl font-semibold disabled:opacity-40"
            >
              Test Tampering
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-b text-slate-400 text-sm">
                <th className="py-4">ID</th>
                <th>Transaction Data</th>
                <th>Previous Hash</th>
                <th>Current Hash</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="border-b text-sm">
                  <td className="py-5">{entry.id}</td>

                  <td className="font-medium">
                    {entry.data}
                  </td>

                  <td className="text-slate-500 font-mono text-xs">
                    {entry.prevHash.slice(0, 12)}...
                  </td>

                  <td className="text-indigo-600 font-mono text-xs">
                    {entry.hash.slice(0, 12)}...
                  </td>

                  <td className="text-slate-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>

                  <td>
                    <button
                      onClick={() => copyHash(entry.hash)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Copy Hash
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEntries.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-slate-400"
                  >
                    No matching ledger entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={resetDemo}
            disabled={entries.length === 0 || loading}
            className="text-red-600 hover:text-red-800 font-semibold px-4 py-2 disabled:opacity-40"
          >
            Reset Demo
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="mt-6 bg-indigo-50 p-5 rounded-xl">
        <h3 className="font-bold text-indigo-800 mb-2">
          How Ledger Verification Works
        </h3>

        <p className="text-sm text-indigo-700 leading-6">
          Each entry contains its own SHA-256 hash and the previous
          entry's hash. If stored data changes without recalculating
          the chain, verification detects the mismatch.
        </p>
      </div>

    </div>
  );
}



function Team() {
  type Member = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "Active" | "Inactive";
  };

  const initialMembers: Member[] = [
    {
      id: 1,
      name: "Abhishek Yadav",
      email: "abhishek@example.com",
      role: "Owner",
      status: "Active",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 3,
      name: "Priya Singh",
      email: "priya@example.com",
      role: "Billing",
      status: "Active",
    },
  ];

  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem("ledgerguard_team");

      if (saved !== null) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed as Member[];
      }

      return initialMembers;
    } catch {
      return initialMembers;
    }
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Billing");

  const saveMembers = (updated: Member[]) => {
    try {
      localStorage.setItem(
        "ledgerguard_team",
        JSON.stringify(updated)
      );
      setMembers(updated);
      return true;
    } catch {
      setMessage("Unable to save team data in browser storage.");
      return false;
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("Billing");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const duplicate = members.some(
      (member) =>
        member.email.toLowerCase() === cleanEmail &&
        member.id !== editingId
    );

    if (duplicate) {
      setMessage("This email address already exists.");
      return;
    }

    let updated: Member[];

    if (editingId !== null) {
      updated = members.map((member) =>
        member.id === editingId
          ? {
              ...member,
              name: cleanName,
              email: cleanEmail,
              role,
            }
          : member
      );
    } else {
      updated = [
        ...members,
        {
          id: Date.now(),
          name: cleanName,
          email: cleanEmail,
          role,
          status: "Active",
        },
      ];
    }

    if (saveMembers(updated)) {
      setMessage(
        editingId !== null
          ? "Team member updated successfully!"
          : "Team member added successfully!"
      );
      resetForm();
    }
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setName(member.name);
    setEmail(member.email);
    setRole(member.role);
    setMessage("");
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    const updated = members.filter((member) => member.id !== id);

    if (saveMembers(updated)) {
      setMessage("Team member deleted successfully!");
    }
  };

  const toggleStatus = (id: number) => {
    const updated = members.map((member) =>
      member.id === id
        ? {
            ...member,
            status:
              member.status === "Active" ? "Inactive" as const : "Active" as const,
          }
        : member
    );

    if (saveMembers(updated)) {
      setMessage("Member status updated successfully!");
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      `${member.name} ${member.email} ${member.role}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" || member.role === roleFilter;

    const matchesStatus =
      statusFilter === "All" || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = members.filter(
    (member) => member.status === "Active"
  ).length;

  const inactiveCount = members.length - activeCount;

  const exportCSV = () => {
    const headers = ["Name", "Email", "Role", "Status"];

    const rows = members.map((member) => [
      member.name,
      member.email,
      member.role,
      member.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ledgerguard-team.csv";
    link.click();

    URL.revokeObjectURL(url);
    setMessage("Team members exported successfully!");
  };

  return (
    <div className="p-5 md:p-9 max-w-[1500px] mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Team Members
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage workspace members and their access.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportCSV}
            className="border border-slate-200 bg-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50"
          >
            ↓ Export CSV
          </button>

          <button
            onClick={() => {
              resetForm();
              setMessage("");
              setShowForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold"
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-slate-500 text-sm">Total Members</p>
          <h3 className="text-3xl font-bold mt-2">
            {members.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-slate-500 text-sm">Active Members</p>
          <h3 className="text-3xl font-bold mt-2 text-emerald-600">
            {activeCount}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-slate-500 text-sm">Inactive Members</p>
          <h3 className="text-3xl font-bold mt-2 text-red-500">
            {inactiveCount}
          </h3>
        </div>

      </div>

      {/* Message */}
      {message && (
        <div className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl p-4 mb-6 flex justify-between gap-3">
          <span>{message}</span>
          <button
            onClick={() => setMessage("")}
            className="font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Members Table */}
      <div className="bg-white rounded-2xl border p-5 md:p-6 shadow-sm">

        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold">All Team Members</h3>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3"
            >
              <option value="All">All Roles</option>
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
              <option value="Billing">Billing</option>
              <option value="Viewer">Viewer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="border-b text-sm text-slate-400">
                <th className="py-4">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b text-sm">

                  <td className="py-5 font-semibold text-slate-800">
                    {member.name}
                  </td>

                  <td className="text-slate-600">
                    {member.email}
                  </td>

                  <td>
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {member.role}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => toggleStatus(member.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {member.status}
                    </button>
                  </td>

                  <td>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-500 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filteredMembers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-slate-400"
                  >
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-400 mt-5">
          Showing {filteredMembers.length} of {members.length} members
        </p>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingId !== null ? "Edit Member" : "Add New Member"}
              </h3>

              <button
                onClick={resetForm}
                className="text-slate-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Member Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3"
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Billing">Billing</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-slate-200 rounded-xl py-3 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold"
                >
                  {editingId !== null ? "Save Changes" : "Add Member"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}



function SettingsPage() {
  type WorkspaceSettings = {
    adminName: string;
    companyName: string;
    email: string;
    currency: string;
    taxId: string;
  };

  type NotificationSettings = {
    invoiceAlerts: boolean;
    paymentAlerts: boolean;
    securityAlerts: boolean;
    weeklyReports: boolean;
  };

  const defaultSettings: WorkspaceSettings = {
    adminName: "Admin User",
    companyName: "Acme Corporation",
    email: "admin@acme.com",
    currency: "INR",
    taxId: "",
  };

  const defaultNotifications: NotificationSettings = {
    invoiceAlerts: true,
    paymentAlerts: true,
    securityAlerts: true,
    weeklyReports: false,
  };

  const [settings, setSettings] = useState<WorkspaceSettings>(() => {
    try {
      const saved = localStorage.getItem("ledgerguard_settings");
      return saved
        ? { ...defaultSettings, ...JSON.parse(saved) }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [notifications, setNotifications] =
    useState<NotificationSettings>(() => {
      try {
        const saved = localStorage.getItem("ledgerguard_notifications");
        return saved
          ? { ...defaultNotifications, ...JSON.parse(saved) }
          : defaultNotifications;
      } catch {
        return defaultNotifications;
      }
    });

  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
    setMessage("");
  };

  const handleNotificationChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
    setMessage("");
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    localStorage.setItem(
      "ledgerguard_settings",
      JSON.stringify(settings)
    );

    localStorage.setItem(
      "ledgerguard_notifications",
      JSON.stringify(notifications)
    );

    setMessage("Settings saved successfully!");
  };

  const handlePasswordChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordMessage("");

    if (newPassword.length < 8) {
      setPasswordMessage("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }

    setPasswordMessage(
      "Password details validated. Connect the backend password API to update your password securely."
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="p-5 md:p-9 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Workspace Settings
        </h2>
        <p className="text-slate-500 mt-2">
          Manage your profile, company information and preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-7">
        {/* Profile Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">
              Profile Information
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Manage your administrator profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Administrator Name
              </label>
              <input
                required
                name="adminName"
                value={settings.adminName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                required
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">
              Company Information
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Update your workspace and billing details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Company Name
              </label>
              <input
                required
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Billing Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tax ID / GSTIN
              </label>
              <input
                name="taxId"
                value={settings.taxId}
                onChange={handleChange}
                placeholder="Enter Tax ID or GSTIN"
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">
              Notification Preferences
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Choose which updates you want to receive.
            </p>
          </div>

          <div className="space-y-5">
            {[
              {
                name: "invoiceAlerts",
                title: "Invoice Alerts",
                description: "Get notified about new and overdue invoices.",
              },
              {
                name: "paymentAlerts",
                title: "Payment Notifications",
                description: "Receive updates when payments are completed.",
              },
              {
                name: "securityAlerts",
                title: "Security Alerts",
                description: "Get notified about important security activity.",
              },
              {
                name: "weeklyReports",
                title: "Weekly Reports",
                description: "Receive a weekly workspace activity summary.",
              },
            ].map((item) => (
              <label
                key={item.name}
                className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0 cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-slate-700">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {item.description}
                  </p>
                </div>

                <input
                  type="checkbox"
                  name={item.name}
                  checked={
                    notifications[
                      item.name as keyof NotificationSettings
                    ]
                  }
                  onChange={handleNotificationChange}
                  className="h-5 w-5 accent-indigo-600 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Save Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {message && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm font-medium">
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-semibold transition"
            >
              Save Settings
            </button>
          </div>
        </div>
      </form>

      {/* Change Password */}
      <form
        onSubmit={handlePasswordChange}
        className="mt-7 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">
            Change Password
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Update your account password.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Current Password
            </label>
            <input
              required
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New Password
              </label>
              <input
                required
                type="password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm New Password
              </label>
              <input
                required
                type="password"
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {passwordMessage && (
          <div className="mt-5 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm">
            {passwordMessage}
          </div>
        )}

        <div className="mt-7 flex justify-end">
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-900 text-white px-7 py-3 rounded-xl font-semibold transition"
          >
            Validate Password Change
          </button>
        </div>
      </form>
    </div>
  );
}

function ModalTest() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-bold mb-5">
          Modal Component Testing
        </h2>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg"
        >
          Open Modal
        </button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Test Successful!"
        >
          <p className="text-slate-600">
            Congratulations! Your Modal Component is working.
          </p>
        </Modal>
      </div>
    </div>
  );
}



function ToastTest() {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-bold mb-5">
          Toast Component Testing
        </h2>

        <button
          onClick={() => setShowToast(true)}
          className="bg-green-600 text-white px-5 py-3 rounded-lg"
        >
          Show Toast
        </button>

        {showToast && (
          <Toast
            type="success"
            message="Toast Component is working successfully!"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
}
function LoadingTest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-bold mb-5">
          Loading Component Testing
        </h2>

        <Loading text="Please wait, loading..." />
      </div>
    </div>
  );
}
function TableTest() {
  const columns = [
    { key: "name", header: "Customer Name" },
    { key: "email", header: "Email" },
    { key: "status", header: "Status" },
  ] as const;

  const data = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Amit Kumar",
      email: "amit@gmail.com",
      status: "Active",
    },
    {
      id: 3,
      name: "Priya Singh",
      email: "priya@gmail.com",
      status: "Inactive",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          Table Component Testing
        </h2>

        <Table
          columns={[...columns]}
          data={data}
          rowKey="id"
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/table-test" element={<TableTest />} />
        <Route path="/loading-test" element={<LoadingTest />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/modal-test" element={<ModalTest />} />
        <Route path="/toast-test" element={<ToastTest />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="customers" element={<Customers />} />
          <Route path="plans" element={<Plans />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
          <Route path="security" element={<Security />} />
          <Route path="team" element={<Team />} />
          <Route path="api-keys" element={<ApiKeys />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;