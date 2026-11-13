'use client';

import React from 'react';
import {
  Target,
  Lightbulb,
  Handshake,
  Zap,
  Sparkles,
  Briefcase,
  Scissors,
  Leaf,
  Trophy,
  Award,
  Globe,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Users,
  Heart,
  Star,
  Compass,
  Rocket,
  Building2,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Layers,
  Gem,
  Crown,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  // Clean icon keys
  target: Target,
  lightbulb: Lightbulb,
  handshake: Handshake,
  zap: Zap,
  sparkles: Sparkles,
  briefcase: Briefcase,
  scissors: Scissors,
  leaf: Leaf,
  trophy: Trophy,
  award: Award,
  globe: Globe,
  calendar: Calendar,
  phone: Phone,
  mail: Mail,
  'map-pin': MapPin,
  mappin: MapPin,
  shield: ShieldCheck,
  'shield-check': ShieldCheck,
  users: Users,
  heart: Heart,
  star: Star,
  compass: Compass,
  rocket: Rocket,
  building: Building2,
  'building-2': Building2,
  'graduation-cap': GraduationCap,
  graduation: GraduationCap,
  check: CheckCircle2,
  'check-circle': CheckCircle2,
  trending: TrendingUp,
  layers: Layers,
  gem: Gem,
  crown: Crown,

  // Legacy emoji fallbacks (for existing DB records)
  '🎯': Target,
  '💡': Lightbulb,
  '🤝': Handshake,
  '⚡': Zap,
  '✨': Sparkles,
  '👔': Briefcase,
  '✂️': Scissors,
  '✂': Scissors,
  '🌿': Leaf,
  '🏆': Trophy,
  '🌍': Globe,
  '🌐': Globe,
  '📅': Calendar,
  '📞': Phone,
  '✉️': Mail,
  '✉': Mail,
  '📍': MapPin,
  '💼': Briefcase,
  '🎓': GraduationCap,
  '🌟': Sparkles,
  '⭐': Star,
  '🚀': Rocket,
  '🏛️': Building2,
  '👥': Users,
};

export const AVAILABLE_ICON_OPTIONS = [
  { value: 'target', label: 'Cible / Excellence' },
  { value: 'lightbulb', label: 'Idée / Innovation' },
  { value: 'handshake', label: 'Partenariat / Intégrité' },
  { value: 'zap', label: 'Énergie / Impact' },
  { value: 'sparkles', label: 'Créativité / Événementiel' },
  { value: 'briefcase', label: 'Entreprise / Conseil' },
  { value: 'scissors', label: 'Mode / Couture' },
  { value: 'leaf', label: 'Beauté / Bien-être' },
  { value: 'trophy', label: 'Trophée / Distinction' },
  { value: 'award', label: 'Récompense / Qualité' },
  { value: 'globe', label: 'International / Afrique' },
  { value: 'graduation-cap', label: 'Formation / Académie' },
  { value: 'shield-check', label: 'Confiance / Sécurité' },
  { value: 'users', label: 'Équipe / Communauté' },
  { value: 'rocket', label: 'Croissance / Ambition' },
  { value: 'gem', label: 'Prestige / Savoir-faire' },
];

export function stripLeadingEmoji(text?: string): string {
  if (!text) return '';
  return text
    .replace(
      /^[\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]+/u,
      ''
    )
    .trim();
}

interface DynamicIconProps {
  name?: string;
  className?: string;
  fallback?: LucideIcon;
}

export default function DynamicIcon({
  name,
  className = 'w-5 h-5',
  fallback: Fallback = Sparkles,
}: DynamicIconProps) {
  if (!name) {
    return <Fallback className={className} />;
  }
  const normalized = name.trim().toLowerCase();
  const IconComponent = ICON_MAP[normalized] || ICON_MAP[name.trim()] || Fallback;
  return <IconComponent className={className} />;
}
