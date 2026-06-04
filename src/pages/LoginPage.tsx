import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const { signIn } = useAuth();

  const onSubmit = async (values: LoginFormValues) => {
    const { error } = await signIn({ email: values.email, password: values.password });

    if (error) {
      toast.error('Falha na autenticação: usuário ou senha inválidos.');
      return;
    }

    toast.success('Login efetuado com sucesso!');
    navigate('/');
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-3xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-glass backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Bem-vindo de volta</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">Faça login na sua conta</h1>
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

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Lock className="h-4 w-4" /> Senha
            </span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password ? <span className="text-sm text-danger">{errors.password.message}</span> : null}
          </label>

          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" {...register('remember')} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
              Lembrar-me
            </label>
            <Link to="/recuperar-senha" className="font-medium text-primary hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Não tem conta?{' '}
          <Link to="/cadastro" className="font-semibold text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
