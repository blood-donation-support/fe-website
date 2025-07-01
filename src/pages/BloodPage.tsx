import React, { useEffect, useState } from 'react';

type BloodItem = {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

const PRIMARY_COLOR = '#236AFE';

export default function BloodPage() {
  const [tab, setTab] = useState<'group' | 'component'>('group');
  const [bloodGroups, setBloodGroups] = useState<BloodItem[]>([]);
  const [bloodComponents, setBloodComponents] = useState<BloodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<BloodItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = tab === 'group' ? '/bloodGroup.json' : '/bloodComponent.json';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (tab === 'group') setBloodGroups(data);
        else setBloodComponents(data);
      } catch (error) {
        console.error(`Error loading ${tab === 'group' ? 'blood groups' : 'components'}`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const handleOpenModal = (item?: BloodItem) => {
    setEditItem(item ?? null);
    setModalOpen(true);
  };

  const handleSave = (data: BloodItem) => {
    const updateList = (list: BloodItem[], setList: (items: BloodItem[]) => void) => {
      if (data._id) {
        setList(list.map(item => (item._id === data._id ? data : item)));
      } else {
        setList([
          ...list,
          {
            ...data,
            _id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }
    };

    if (tab === 'group') {
      updateList(bloodGroups, setBloodGroups);
    } else {
      updateList(bloodComponents, setBloodComponents);
    }

    setModalOpen(false);
  };

  const list = tab === 'group' ? bloodGroups : bloodComponents;

  return (
    <div className="px-3 py-6">
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-full font-medium ${
            tab === 'group' ? 'text-white' : 'text-gray-700'
          }`}
          style={{
            backgroundColor: tab === 'group' ? PRIMARY_COLOR : '#E5E7EB',
          }}
          onClick={() => setTab('group')}
        >
          Blood Groups
        </button>
        <button
          className={`px-4 py-2 rounded-full font-medium ${
            tab === 'component' ? 'text-white' : 'text-gray-700'
          }`}
          style={{
            backgroundColor: tab === 'component' ? PRIMARY_COLOR : '#E5E7EB',
          }}
          onClick={() => setTab('component')}
        >
          Blood Components
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {tab === 'group' ? 'Blood Groups' : 'Blood Components'}
        </h2>
        <button
          className="px-4 py-2 rounded-md text-white font-medium hover:opacity-90"
          style={{ backgroundColor: PRIMARY_COLOR }}
          onClick={() => handleOpenModal()}
        >
          + Add New
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-xl overflow-hidden shadow">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="border p-3">Name</th>
                <th className="border p-3">Created At</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="border p-3 text-gray-800">{item.name}</td>
                  <td className="border p-3 text-gray-600">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    <button
                      className="text-[13px] text-blue-600 hover:underline font-medium"
                      onClick={() => handleOpenModal(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500 italic">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ModalForm
          defaultValue={editItem}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ModalForm({
  defaultValue,
  onClose,
  onSave,
}: {
  defaultValue: BloodItem | null;
  onClose: () => void;
  onSave: (item: BloodItem) => void;
}) {
  const [name, setName] = useState(defaultValue?.name || '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {defaultValue ? 'Edit' : 'Add'} Blood {defaultValue ? 'Item' : 'Entry'}
        </h3>

        <input
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={() =>
              onSave({
                _id: defaultValue?._id || '',
                name,
                created_at: defaultValue?.created_at || '',
                updated_at: new Date().toISOString(),
              })
            }
          >
            {defaultValue ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
