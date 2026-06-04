import Joi from 'joi';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
export type LoginFormData = {
  email: string;
  password: string;
};
export type InscriptionFormData = {
  nom: string;
  email: string;
  telephone?: string;
  formationId: number;
};
export type CandidatureFormData = {
  nom: string;
  email: string;
  telephone?: string;
  poste: string;
  cv?: FileList;
};
export type ServiceRequestFormData = {
  nom: string;
  entreprise?: string;
  telephone?: string;
  service: string;
  message: string;
  date_evenement?: string;
};
export type ContactFormData = {
  nom: string;
  email: string;
  message: string;
};
export type FormationFormData = {
  title: string;
  description?: string;
  date?: string;
  lieu?: string;
  prix?: number;
  places_disponibles?: number;
};

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
const nom = Joi.string().min(2).max(100).required().messages({
  'string.empty': 'Le nom est obligatoire',
  'string.min':   'Le nom doit contenir au moins 2 caractères',
  'any.required': 'Le nom est obligatoire',
});
const email = Joi.string().email({ tlds: { allow: false } }).required().messages({
  'string.empty': "L'email est obligatoire",
  'string.email': "L'adresse e-mail est invalide",
  'any.required': "L'email est obligatoire",
});
const telephone = Joi.string().pattern(/^[+]?[0-9\s\-().]{7,20}$/).optional().allow('').messages({
  'string.pattern.base': 'Numéro de téléphone invalide',
});

// ─────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────
export const loginSchema = Joi.object({
  email: email,
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Le mot de passe est obligatoire',
    'string.min':   'Minimum 6 caractères',
    'any.required': 'Le mot de passe est obligatoire',
  }),
}).unknown(true);

export const inscriptionSchema = Joi.object({
  nom,
  email: email,
  telephone,
  formationId: Joi.number().positive().required().messages({
    'any.required': 'Sélectionnez une formation',
    'number.base':  'Sélectionnez une formation',
  }),
}).unknown(true);

export const candidatureSchema = Joi.object({
  nom,
  email: email,
  telephone,
  poste: Joi.string().min(1).required().messages({
    'string.empty': 'Sélectionnez un poste',
    'any.required': 'Sélectionnez un poste',
  }),
}).unknown(true);

export const serviceRequestSchema = Joi.object({
  nom,
  entreprise:     Joi.string().max(255).optional().allow(''),
  telephone,
  service: Joi.string().min(1).required().messages({
    'string.empty': 'Sélectionnez un service',
    'any.required': 'Sélectionnez un service',
  }),
  message: Joi.string().min(10).max(2000).required().messages({
    'string.empty': 'Le message est obligatoire',
    'string.min':   'Décrivez votre besoin (min. 10 caractères)',
    'any.required': 'Le message est obligatoire',
  }),
  date_evenement: Joi.string().optional().allow(''),
}).unknown(true);

export const contactSchema = Joi.object({
  nom,
  email: email,
  message: Joi.string().min(10).max(2000).required().messages({
    'string.empty': 'Le message est obligatoire',
    'string.min':   'Minimum 10 caractères',
    'any.required': 'Le message est obligatoire',
  }),
}).unknown(true);

export const formationSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'Le titre est obligatoire',
    'string.min':   'Minimum 3 caractères',
    'any.required': 'Le titre est obligatoire',
  }),
  description:        Joi.string().max(5000).optional().allow(''),
  date:               Joi.string().optional().allow(''),
  lieu:               Joi.string().max(255).optional().allow(''),
  prix:               Joi.number().min(0).optional(),
  places_disponibles: Joi.number().integer().min(1).optional(),
}).unknown(true);

// ─────────────────────────────────────────────────────────────────
// Fonction utilitaire : valide et retourne { fieldErrors }
// ─────────────────────────────────────────────────────────────────
export function validateForm<T>(
  schema: Joi.ObjectSchema,
  data: T
): Record<string, string> {
  const { error } = schema.validate(data, { abortEarly: false });
  if (!error) return {};
  const errs: Record<string, string> = {};
  error.details.forEach((d) => {
    const key = d.path[0] as string;
    if (!errs[key]) errs[key] = d.message;
  });
  return errs;
}
