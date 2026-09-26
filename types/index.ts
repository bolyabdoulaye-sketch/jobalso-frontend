export type TypeUtilisateur = "CANDIDAT" | "RECRUTEUR";
export type StatusUtilisateur = "ACTIF" | "INACTIF" | "EN_ATTENTE" | "SUPPRIME";
export type NiveauCritere = "OBLIGATOIRE" | "IMPORTANT" | "SOUHAITABLE";

export interface Entreprise {
  nom_entreprise: string;
  pays: string;
  localisation_entreprise?: string;
}

export interface Utilisateur {
  id_utilisateur: string;
  email: string;
  numero_telephone: string;
  nom_prenom: string;
  type_utilisateur: TypeUtilisateur;
  status: StatusUtilisateur;
  date_creation: string;
  must_change_password: boolean;
  consentement_accepte: boolean;
  consentement_date: string | null;
  consentement_version: string | null;
}

export interface InscriptionPayload {
  email: string;
  numero_telephone: string;
  mot_de_passe: string;
  nom_prenom: string;
  type_utilisateur: TypeUtilisateur;
  consentement_accepte: boolean;
  entreprise?: Entreprise;
}

export interface CV {
  id_cv: string;
  id_candidat: string;
  resume_cv: string | null;
  experience: unknown;
  education: unknown;
  langues: unknown;
  domaine_etude: unknown;
  competences: unknown;
  certifications: unknown;
  localisation: string | null;
  type_poste_recherche: string | null;
  statut_cv: string | null;
  code_cv: string;
  date_creation: string;
  date_modification: string | null;
  taux_completude: number;
}

export interface CVPayload {
  resume_cv?: string;
  experience?: unknown;
  education?: unknown;
  langues?: unknown;
  domaine_etude?: unknown;
  competences?: unknown;
  certifications?: unknown;
  localisation?: string;
  type_poste_recherche?: string;
}
export interface CritereOffre {
  id_critere: string;
  libelle: string;
  niveau: NiveauCritere;
}

export interface CritereOffrePayload {
  libelle: string;
  niveau: NiveauCritere;
}

export interface Offre {
  id_offre: string;
  id_recruteur: string;
  titre_offre: string;
  description: unknown;
  type_contrat: string | null;
  revenu: number | null;
  date_debut: string | null;
  date_fin: string | null;
  status: boolean;
  resume_offre: string | null;
  lien_token: string;
  date_publication: string;
  date_modification: string | null;
  criteres: CritereOffre[];
}

export interface OffrePayload {
  titre_offre: string;
  description?: unknown;
  type_contrat?: string;
  revenu?: number;
  date_debut?: string;
  date_fin?: string;
  resume_offre?: string;
  criteres?: CritereOffrePayload[];
}

export interface Resultat {
  id_resultat: string;
  id_offre: string;
  id_cv: string;
  score_sim: number;
  statut_candidature: string | null;
  date_modification: string | null;
}
