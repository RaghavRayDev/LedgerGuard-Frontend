
import { useState, useEffect } from "react";
import {
  KeyRound,
  Plus,
  Search,
  Copy,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

type ApiKey = {
  id: number;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  active: boolean;
};

function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>(() => {
    try {
      const savedKeys = localStorage.getItem("ledgerguard_api_keys");

      if (savedKeys) {
        return JSON.parse(savedKeys) as ApiKey[];
      }
    } catch (error) {
      console.error("Error loading API keys:", error);
    }

    return [
      {
        id: 1,
        name: "Production API",
        key: "lg_live_8f2a9c7d4e1b",
        created: "Nov 10, 2026",
        lastUsed: "Today",
        active: true,
      },
      {
        id: 2,
        name: "Development API",
        key: "lg_test_3b7d9e2f5a1c",
        created: "Nov 12, 2026",
        lastUsed: "Yesterday",
        active: true,
      },
    ];
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [keyName, setKeyName] = useState("");
  const [message, setMessage] = useState("");

  // Save API Keys in localStorage
  useEffect(() => {
    localStorage.setItem(
      "ledgerguard_api_keys",
      JSON.stringify(keys)
    );
  }, [keys]);

  const filteredKeys = keys.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Open Add Modal
  const openAddModal = () => {
    setEditingId(null);
    setKeyName("");
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (item: ApiKey) => {
    setEditingId(item.id);
    setKeyName(item.name);
    setShowModal(true);
  };

  // Create and Update API Key
  const saveKey = () => {
    if (!keyName.trim()) {
      setMessage("Please enter API key name!");
      return;
    }

    if (editingId !== null) {
      setKeys((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...item, name: keyName.trim() }
            : item
        )
      );

      setMessage("API Key updated successfully!");
    } else {
      const newKey: ApiKey = {
        id: Date.now(),
        name: keyName.trim(),
        key:
          "lg_test_" +
          Math.random().toString(36).substring(2, 14),
        created: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        lastUsed: "Never",
        active: true,
      };

      setKeys((previous) => [...previous, newKey]);
      setMessage("API Key created successfully!");
    }

    setShowModal(false);
    setKeyName("");
  };

  // Revoke API Key
  const revokeKey = (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to revoke this API key?"
      )
    ) {
      return;
    }

    setKeys((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, active: false }
          : item
      )
    );

    setMessage("API Key revoked successfully!");
  };

  // Reactivate API Key
  const reactivateKey = (id: number) => {
    if (
      !window.confirm(
        "Do you want to activate this API key again?"
      )
    ) {
      return;
    }

    setKeys((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, active: true }
          : item
      )
    );

    setMessage("API Key activated successfully!");
  };

  // Permanently Delete API Key
  const deleteKey = (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this API key?"
      )
    ) {
      return;
    }

    setKeys((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setMessage("API Key deleted successfully!");
  };

  // Copy API Key
  const copyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setMessage("API Key copied successfully!");
    } catch {
      setMessage("Unable to copy API Key.");
    }
  };

  return (
    <div className="p-5 md:p-9 max-w-[1500px] mx-auto">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            API Keys
          </h2>

          <p className="text-slate-500 mt-1">
            Manage and secure your API access keys.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          <Plus size={18} />
          Create API Key
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-5 p-3 bg-indigo-50 text-indigo-700 rounded-xl flex justify-between items-center">
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex justify-between">
            <p className="text-slate-500">Total API Keys</p>
            <KeyRound className="text-indigo-600" />
          </div>

          <h3 className="text-3xl font-bold mt-3">
            {keys.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex justify-between">
            <p className="text-slate-500">Active Keys</p>
            <CheckCircle2 className="text-green-600" />
          </div>

          <h3 className="text-3xl font-bold mt-3">
            {keys.filter((item) => item.active).length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex justify-between">
            <p className="text-slate-500">Revoked Keys</p>
            <ShieldCheck className="text-red-500" />
          </div>

          <h3 className="text-3xl font-bold mt-3">
            {keys.filter((item) => !item.active).length}
          </h3>
        </div>

      </div>

      {/* API Keys Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        {/* Search */}
        <div className="p-5 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search API keys..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="p-5">KEY NAME</th>
                <th className="p-5">API KEY</th>
                <th className="p-5">CREATED</th>
                <th className="p-5">LAST USED</th>
                <th className="p-5">STATUS</th>
                <th className="p-5">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredKeys.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >

                  <td className="p-5 font-semibold text-slate-800">
                    {item.name}
                  </td>

                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-slate-500">
                        {item.key}
                      </code>

                      <button
                        type="button"
                        onClick={() => copyKey(item.key)}
                        title="Copy API Key"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </td>

                  <td className="p-5 text-slate-500 text-sm">
                    {item.created}
                  </td>

                  <td className="p-5 text-slate-500 text-sm">
                    {item.lastUsed}
                  </td>

                  <td className="p-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.active ? "Active" : "Revoked"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-5">
                    <div className="flex items-center gap-3">

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        title="Edit API Key"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Revoke / Activate */}
                      {item.active ? (
                        <button
                          type="button"
                          onClick={() => revokeKey(item.id)}
                          title="Revoke API Key"
                          className="text-orange-500 hover:text-orange-700 text-xs font-semibold"
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => reactivateKey(item.id)}
                          title="Reactivate API Key"
                          className="text-green-600 hover:text-green-800 text-xs font-semibold flex items-center gap-1"
                        >
                          <RotateCcw size={15} />
                          Activate
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => deleteKey(item.id)}
                        title="Delete API Key"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {filteredKeys.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-slate-400"
                  >
                    No API Keys found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId !== null
                  ? "Edit API Key"
                  : "Create API Key"}
              </h3>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              API Key Name
            </label>

            <input
              type="text"
              placeholder="Enter API key name"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveKey();
              }}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveKey}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                {editingId !== null
                  ? "Update Key"
                  : "Create Key"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ApiKeys;
