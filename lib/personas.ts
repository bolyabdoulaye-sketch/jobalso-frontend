export interface Persona {
  id: string;
  icon: string;
  label: string;
  tagline: string;
}

export const PERSONAS: Persona[] = [
  { id: "pme", icon: "🏢", label: "PME", tagline: "Recruter efficacement avec des ressources limitées" },
  { id: "entrepreneur", icon: "🚀", label: "Entrepreneur", tagline: "Votre premier recrutement, sans expérience RH" },
  { id: "rh", icon: "📋", label: "Responsable RH", tagline: "Un processus rigoureux, cohérent et traçable" },
  { id: "recruteur", icon: "🎯", label: "Recruteur", tagline: "Gérez plusieurs mandats clients à haut volume" },
  { id: "gestionnaire", icon: "🧭", label: "Gestionnaire sans équipe RH", tagline: "Recrutez sereinement, même sans expertise RH" },
];

export function getPersonaById(id: string | null): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}
