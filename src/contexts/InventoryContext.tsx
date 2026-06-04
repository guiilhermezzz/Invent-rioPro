import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuth } from './AuthContext';

export type InventoryStatus = 'Disponível' | 'Em uso' | 'Manutenção';

export type InventoryItem = {
  id: string;
  name: string;
  code: string;
  sector: string;
  status: InventoryStatus;
  responsible: string;
  description: string;
  createdAt: string;
};

type InventoryPayload = Omit<InventoryItem, 'id' | 'createdAt'>;

type InventoryContextValue = {
  items: InventoryItem[];
  createItem: (payload: InventoryPayload) => Promise<void>;
  updateItem: (id: string, payload: InventoryPayload) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshItems: () => Promise<void>;
};

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

const initialInventory: InventoryItem[] = [];

function mapInventoryRow(row: any): InventoryItem {
  return {
    id: row.id,
    name: row.equipamento,
    code: row.codigo,
    sector: row.setor,
    status: row.estado as InventoryStatus,
    responsible: row.responsavel,
    description: row.description ?? '',
    createdAt: row.created_at,
  };
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);

  const refreshItems = async () => {
    if (!user?.id) {
      setItems([]);
      return;
    }

    const { data, error } = await supabase
      .from('inventory_items')
      .select('id,equipamento,codigo,setor,estado,responsavel,description,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar inventário', error);
      return;
    }

    setItems((data ?? []).map(mapInventoryRow));
  };

  useEffect(() => {
    void refreshItems();
  }, [user?.id]);

  const createItem = async (payload: InventoryPayload) => {
    if (!user?.id) return;

    const inventoryPayload = {
      user_id: user.id,
      equipamento: payload.name,
      codigo: payload.code,
      setor: payload.sector,
      estado: payload.status,
      responsavel: payload.responsible,
      description: payload.description,
    };

    const { data, error } = await supabase
      .from('inventory_items')
      .insert(inventoryPayload)
      .select()
      .single();

    if (error || !data) {
      console.error('Erro ao adicionar item ao inventário', error);
      return;
    }

    setItems((current) => [mapInventoryRow(data), ...current]);

    const dashboardPayload = {
      inventory_item_id: data.id,
      user_id: user.id,
      equipamento: data.equipamento,
      codigo: data.codigo,
      setor: data.setor,
      estado: data.estado,
      responsavel: data.responsavel,
      description: data.description ?? '',
    };

    const { error: dashboardError } = await supabase.from('dashboard_items').insert(dashboardPayload);
    if (dashboardError) {
      console.error('Erro ao adicionar item ao dashboard', dashboardError);
    }
  };

  const updateItem = async (id: string, payload: InventoryPayload) => {
    if (!user?.id) return;

    const inventoryPayload = {
      equipamento: payload.name,
      codigo: payload.code,
      setor: payload.sector,
      estado: payload.status,
      responsavel: payload.responsible,
      description: payload.description,
    };

    const { data, error } = await supabase
      .from('inventory_items')
      .update(inventoryPayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) {
      console.error('Erro ao atualizar item do inventário', error);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id ? mapInventoryRow(data) : item,
      ),
    );

    const dashboardPayload = {
      user_id: user.id,
      equipamento: data.equipamento,
      codigo: data.codigo,
      setor: data.setor,
      estado: data.estado,
      responsavel: data.responsavel,
      description: data.description ?? '',
    };

    const { data: dashboardData, error: dashboardUpdateError } = await supabase
      .from('dashboard_items')
      .update(dashboardPayload)
      .eq('inventory_item_id', id)
      .eq('user_id', user.id)
      .select();

    if (dashboardUpdateError) {
      console.error('Erro ao atualizar item no dashboard', dashboardUpdateError);
      return;
    }

    if (!dashboardData?.length) {
      const { error: dashboardInsertError } = await supabase.from('dashboard_items').insert({
        inventory_item_id: id,
        ...dashboardPayload,
      });
      if (dashboardInsertError) {
        console.error('Erro ao criar item no dashboard após atualização', dashboardInsertError);
      }
    }
  };

  const deleteItem = async (id: string) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Erro ao excluir item do inventário', error);
      return;
    }

    await supabase
      .from('dashboard_items')
      .delete()
      .eq('inventory_item_id', id)
      .eq('user_id', user.id);

    setItems((current) => current.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({ items, createItem, updateItem, deleteItem, refreshItems }),
    [items, user?.id],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used inside InventoryProvider');
  }
  return context;
}
