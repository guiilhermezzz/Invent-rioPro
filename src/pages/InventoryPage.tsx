import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInventory } from '../contexts/InventoryContext';

const inventorySchema = z.object({
  name: z.string().min(3, 'Informe o nome do equipamento'),
  code: z.string().min(2, 'Informe o código'),
  sector: z.string().min(2, 'Informe o setor'),
  status: z.enum(['Disponível', 'Em uso', 'Manutenção']),
  responsible: z.string().min(2, 'Informe o responsável'),
  description: z.string().min(1, 'Informe a descrição'),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

const defaultValues: InventoryFormValues = {
  name: '',
  code: '',
  sector: '',
  status: 'Disponível',
  responsible: '',
  description: '',
};

export default function InventoryPage() {
  const { items, createItem, updateItem, deleteItem } = useInventory();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  type SortOption = 'A-Z' | 'Z-A';
  const sortOptions: SortOption[] = ['A-Z', 'Z-A'];
  const [sortOption, setSortOption] = useState<SortOption>('A-Z');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    mode: 'onChange',
    defaultValues,
  });

  const itemToEdit = useMemo(
    () => items.find((item) => item.id === editingItemId) ?? null,
    [editingItemId, items],
  );

  useEffect(() => {
    if (itemToEdit) {
      reset({
        name: itemToEdit.name,
        code: itemToEdit.code,
        sector: itemToEdit.sector,
        status: itemToEdit.status,
        responsible: itemToEdit.responsible,
        description: itemToEdit.description,
      });
      return;
    }

    reset(defaultValues);
  }, [itemToEdit, reset]);

  const totalAvailable = useMemo(
    () => items.filter((item) => item.status === 'Disponível').length,
    [items],
  );

  const totalInUse = useMemo(
    () => items.filter((item) => item.status === 'Em uso').length,
    [items],
  );

  const totalMaintenance = useMemo(
    () => items.filter((item) => item.status === 'Manutenção').length,
    [items],
  );

  const handleSaveItem = async (values: InventoryFormValues) => {
    if (editingItemId) {
      await updateItem(editingItemId, values);
      toast.success('Equipamento atualizado com sucesso.');
      setEditingItemId(null);
      return;
    }

    await createItem(values);
    toast.success('Equipamento adicionado ao inventário.');
    reset(defaultValues);
  };

  const handleDeleteItem = (id: string) => {
    const confirmed = window.confirm('Deseja realmente excluir este equipamento?');
    if (!confirmed) return;

    deleteItem(id);
    toast.success('Equipamento removido do inventário.');

    if (editingItemId === id) {
      setEditingItemId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    reset(defaultValues);
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
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Inventário</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Gerencie seus ativos</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">Crie, edite e exclua itens de inventário de forma rápida.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{editingItemId ? 'Editar equipamento' : 'Adicionar equipamento'}</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(handleSaveItem)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Item</span>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {errors.name ? <span className="text-sm text-danger">{errors.name.message}</span> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Código</span>
                <input
                  type="text"
                  {...register('code')}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {errors.code ? <span className="text-sm text-danger">{errors.code.message}</span> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Setor</span>
                <input
                  type="text"
                  {...register('sector')}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {errors.sector ? <span className="text-sm text-danger">{errors.sector.message}</span> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
                <select
                  {...register('status')}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option>Disponível</option>
                  <option>Em uso</option>
                  <option>Manutenção</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Responsável</span>
                <input
                  type="text"
                  {...register('responsible')}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {errors.responsible ? <span className="text-sm text-danger">{errors.responsible.message}</span> : null}
              </label>

            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Descrição</span>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Plus className="h-4 w-4" />
                {editingItemId ? 'Atualizar equipamento' : 'Adicionar equipamento'}
              </button>
              {editingItemId ? (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancelar edição
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Status do inventário</h2>
          <div className="mt-5 space-y-4 text-slate-700 dark:text-slate-300">
            <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Total de itens</p>
              <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{items.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Disponíveis</p>
              <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{totalAvailable}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Em uso</p>
              <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{totalInUse}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Manutenção</p>
              <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{totalMaintenance}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Categoria</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ordenar itens por</p>
        </div>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
          <thead className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Setor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Responsável</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Nenhum item cadastrado no inventário.
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="px-4 py-4 text-slate-800 dark:text-slate-100">{item.name}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{item.code}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{item.sector}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{item.status}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{item.responsible}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingItemId(item.id)}
                        className="inline-flex h-10 items-center justify-center rounded-3xl border border-slate-300 bg-slate-100 px-3 text-sm text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="inline-flex h-10 items-center justify-center rounded-3xl border border-red-200 bg-red-50 px-3 text-sm text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
