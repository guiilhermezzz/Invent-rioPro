import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Key } from 'lucide-react';

const recoverSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
});

type RecoverFormValues = z.infer<typeof recoverSchema>;

export default function RecoverPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoverFormValues>({ resolver: zodResolver(recoverSchema) });

  const onSubmit = async (values: RecoverFormValues) => {
    console.log(values);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-3xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-glass backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Recuperar senha</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">Enviaremos um link para redefinir</h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Mail className="h-4 w-4" /> E-mail
            </span>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            {errors.email ? <span className="text-sm text-danger">{errors.email.message}</span> : null}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}
