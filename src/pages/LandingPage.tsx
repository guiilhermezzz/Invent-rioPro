import { ShieldCheck, Activity, Layers, Wrench, Globe, Lock } from 'lucide-react';

const cards = [
  { title: 'Controle Total', icon: ShieldCheck, description: 'Rastreie todos os bens e movimentações com segurança.' },
  { title: 'Relatórios Inteligentes', icon: Activity, description: 'Dashboards práticos com filtros e exportação.' },
  { title: 'Multi-Setores', icon: Layers, description: 'Organize ativos por unidades, departamentos e responsáveis.' },
  { title: 'Manutenção Preventiva', icon: Wrench, description: 'Gerencie ordens, prazos e custos de manutenção.' },
  { title: 'Acesso em Qualquer Lugar', icon: Globe, description: 'Interface responsiva para desktop e mobile.' },
  { title: 'Segurança', icon: Lock, description: 'Autenticação e permissões para cada perfil.' },
];

export default function LandingPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">Solução de Inventário</p>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">Gerencie seu inventário com inteligência</h1>
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">Acesse as funcionalidades do sistema através dos cards abaixo.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{card.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
