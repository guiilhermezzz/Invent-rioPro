import { useMemo, useState } from 'react';
import { useInventory, InventoryItem } from '../contexts/InventoryContext';
import { toast } from 'sonner';

type NewItemPayload = Omit<InventoryItem, 'id' | 'createdAt'>;

export default function DashboardPage() {
  const { items, createItem, updateItem } = useInventory();

  // State for new item form
  const [newItem, setNewItem] = useState<NewItemPayload>({
    name: '',
    code: '',
    sector: '',
    status: 'Disponível',
    responsible: '',
    description: '',
  });

  type SortOption = 'A-Z' | 'Z-A';
  const sortOptions: SortOption[] = ['A-Z', 'Z-A'];

  // State for editing item names
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('A-Z');

  const handleNewChange = (key: keyof NewItemPayload, value: string) => {
    setNewItem((s) => ({ ...s, [key]: value }));
  };

  const isNewItemValid = () => {
    return [
      newItem.name,
      newItem.code,
      newItem.sector,
      newItem.status,
      newItem.responsible,
      newItem.description,
    ].every((value) => typeof value === 'string' && value.trim().length > 0);
  };

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isNewItemValid()) {
      toast.error('Preencha todos os campos para cadastrar o equipamento.');
      return;
    }

    try {
      await createItem({
        name: newItem.name,
        code: newItem.code,
        sector: newItem.sector,
        status: (newItem.status as InventoryItem['status']),
        responsible: newItem.responsible,
        description: newItem.description,
      });
      toast.success('Equipamento criado com sucesso');
      setNewItem({ name: '', code: '', sector: '', status: 'Disponível', responsible: '', description: '' });
    } catch (err) {
      toast.error('Erro ao criar equipamento');
    }
  };

  const handleEditName = async (id: string) => {
    if (!editingName.trim()) {
      toast.error('Nome não pode ser vazio');
      return;
    }
    try {
      const item = items.find((it) => it.id === id);
      if (!item) throw new Error('Item não encontrado');
      await updateItem(id, { ...item, name: editingName });
      toast.success('Nome atualizado com sucesso');
      setEditingNameId(null);
    } catch (err) {
      toast.error('Erro ao atualizar nome');
    }
  };

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    return sortOption === 'Z-A'
      ? sorted.sort((a, b) => b.name.localeCompare(a.name))
      : sorted.sort((a, b) => a.name.localeCompare(b.name));
  }, [items, sortOption]);

  return (
    <section className="mx-auto max-w-7xl space-y-6 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-glass dark:border-slate-800 dark:bg-slate-900/95">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Gerenciamento de equipamentos</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">Crie, organize e acompanhe os equipamentos em um painel com estilo uniforme ao inventário.</p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-1">
        <form onSubmit={handleCreate} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">Novo equipamento</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={newItem.name}
              onChange={(e) => handleNewChange('name', e.target.value)}
              placeholder="Equipamento"
              className="rounded-3xl border border-slate-300 bg-white px-3 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
            />
            <input
              value={newItem.code}
              onChange={(e) => handleNewChange('code', e.target.value)}
              placeholder="Código"
              className="rounded-3xl border border-slate-300 bg-white px-3 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
            />
            <input
              value={newItem.sector}
              onChange={(e) => handleNewChange('sector', e.target.value)}
              placeholder="Setor"
              className="rounded-3xl border border-slate-300 bg-white px-3 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
            />
            <select
              value={newItem.status}
              onChange={(e) => handleNewChange('status', e.target.value)}
              className="rounded-3xl border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="Disponível">Disponível</option>
              <option value="Em uso">Em uso</option>
              <option value="Manutenção">Manutenção</option>
            </select>
            <input
              value={newItem.responsible}
              onChange={(e) => handleNewChange('responsible', e.target.value)}
              placeholder="Responsável"
              className="rounded-3xl border border-slate-300 bg-white px-3 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
            />
          </div>
          <div className="mt-4">
            <input
              value={newItem.description}
              onChange={(e) => handleNewChange('description', e.target.value)}
              placeholder="Descrição do equipamento"
              className="w-full rounded-3xl border border-slate-300 bg-white px-3 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={!isNewItemValid()}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              Salvar
            </button>
          </div>
        </form>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Categoria</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ordenar itens</p>
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {sortedItems.map((it) => (
            <div key={it.id} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  {editingNameId === it.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditName(it.id)}
                        className="rounded-lg bg-green-600 px-3 py-2 text-white text-sm transition hover:bg-green-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingNameId(null)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600" onClick={() => { setEditingNameId(it.id); setEditingName(it.name); }}>
                      {it.name}
                    </h3>
                  )}
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <p><strong>Código:</strong> {it.code}</p>
                <p><strong>Setor:</strong> {it.sector}</p>
                <p><strong>Estado:</strong> {it.status}</p>
                <p><strong>Responsável:</strong> {it.responsible}</p>
                {it.description && <p><strong>Descrição:</strong> {it.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
