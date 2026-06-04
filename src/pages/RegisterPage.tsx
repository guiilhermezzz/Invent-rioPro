import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Informe pelo menos 3 caracteres'),
  cargo: z.string().min(2, 'Informe o cargo').optional(),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme a senha'),
  terms: z.boolean().refine((value) => value === true, 'Você deve aceitar os termos'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'As senhas devem coincidir',
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    const { error } = await signUp({ fullName: values.fullName, email: values.email, password: values.password, cargo: values.cargo });
    if (error) {
      return;
    }

    toast.success('Cadastro realizado com sucesso!');
    navigate('/');
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-3xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-glass backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Crie sua conta</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">Registre-se e comece a usar</h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <User className="h-4 w-4" /> Nome completo
            </span>
            <input
              type="text"
              {...register('fullName')}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">Cargo (opcional)</span>
            <input
              type="text"
              {...register('cargo')}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            {errors.cargo ? <span className="text-sm text-danger">{errors.cargo.message}</span> : null}
          </label>

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

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Lock className="h-4 w-4" /> Senha
            </span>
            <input
              type="password"
              {...register('password')}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            {errors.password ? <span className="text-sm text-danger">{errors.password.message}</span> : null}
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">Confirmar senha</span>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            {errors.confirmPassword ? <span className="text-sm text-danger">{errors.confirmPassword.message}</span> : null}
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input type="checkbox" {...register('terms')} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
            Aceito os termos de uso
          </label>
          {errors.terms ? <span className="text-sm text-danger">{errors.terms.message}</span> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
