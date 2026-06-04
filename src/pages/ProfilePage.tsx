import { useEffect, useState, type ChangeEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const cargoOptions = [
  'Analista de Inventário',
  'Técnico de Manutenção',
  'Supervisor de Estoque',
  'Outro',
] as const;

type CargoOption = (typeof cargoOptions)[number];

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.fullName ?? '');
  const [editedEmail, setEditedEmail] = useState(user?.email ?? '');
  const currentCargo = user?.cargo ?? 'Analista de Inventário';
  const [selectedCargoOption, setSelectedCargoOption] = useState<CargoOption>(
    cargoOptions.includes(currentCargo as CargoOption)
      ? (currentCargo as CargoOption)
      : 'Outro',
  );
  const [customCargo, setCustomCargo] = useState(
    cargoOptions.includes(currentCargo as CargoOption) ? '' : currentCargo,
  );
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const effectiveCargo = user?.cargo ?? 'Analista de Inventário';
    setEditedName(user?.fullName ?? '');
    setEditedEmail(user?.email ?? '');
    setSelectedCargoOption(
      cargoOptions.includes(effectiveCargo as CargoOption)
        ? (effectiveCargo as CargoOption)
        : 'Outro',
    );
    setCustomCargo(cargoOptions.includes(effectiveCargo as CargoOption) ? '' : effectiveCargo);
    setAvatarUrl(user?.avatarUrl ?? '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, [user]);

  const handleSave = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      toast.error('Nome e e-mail são obrigatórios');
      return;
    }

    const chosenCargo =
      selectedCargoOption === 'Outro' ? customCargo.trim() : selectedCargoOption;

    if (selectedCargoOption === 'Outro' && !chosenCargo) {
      toast.error('Informe o cargo manualmente ao selecionar Outro');
      return;
    }

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
        toast.error('Preencha todos os campos de senha para alterar a senha.');
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error('A nova senha e a confirmação não coincidem.');
        return;
      }
    }

    const result = await updateUserProfile({
      fullName: editedName.trim(),
      email: editedEmail.trim(),
      cargo: chosenCargo,
      avatarUrl,
      currentPassword: currentPassword.trim(),
      newPassword: newPassword.trim(),
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Dados atualizados com sucesso!');
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(user?.fullName ?? '');
    setEditedEmail(user?.email ?? '');
    setSelectedCargoOption(
      cargoOptions.includes(user?.cargo as CargoOption)
        ? (user?.cargo as CargoOption)
        : 'Outro',
    );
    setCustomCargo(cargoOptions.includes(user?.cargo as CargoOption) ? '' : user?.cargo ?? '');
    setAvatarUrl(user?.avatarUrl ?? '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditing(false);
  };

  return (
    <section className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-glass dark:border-slate-800 dark:bg-slate-900/95">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Perfil</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Meu perfil</h1>
      </header>
      <div className="grid gap-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dados pessoais</p>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                Editar
              </button>
            )}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-600 dark:text-slate-300">
                  {user?.fullName
                    ? user.fullName
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'US'}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Foto de perfil</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Use a edição para trocar sua imagem.
              </p>
            </div>
          </div>

          {!isEditing ? (
            <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                <span className="font-semibold">Nome:</span> {user?.fullName ?? 'Usuário não autenticado'}
              </p>
              <p>
                <span className="font-semibold">E-mail:</span> {user?.email ?? 'Não disponível'}
              </p>
              <p>
                <span className="font-semibold">Cargo:</span> {user?.cargo ?? 'Analista de Inventário'}
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Nome
                </label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  E-mail
                </label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Cargo
                </label>
                <select
                  value={selectedCargoOption}
                  onChange={(e) => setSelectedCargoOption(e.target.value as CargoOption)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {cargoOptions.map((cargo) => (
                    <option key={cargo} value={cargo}>
                      {cargo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Carregar foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        setAvatarUrl(reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none transition file:cursor-pointer file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:file:bg-slate-800 dark:file:text-slate-200"
                />
              </div>
              {selectedCargoOption === 'Outro' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Cargo personalizado
                  </label>
                  <input
                    type="text"
                    value={customCargo}
                    onChange={(e) => setCustomCargo(e.target.value)}
                    placeholder="Descreva seu cargo"
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              )}
              <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mudar senha</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Preencha apenas se quiser trocar sua senha.
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Senha atual
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Nova senha
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Confirmar nova senha
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
